from pyquery import PyQuery as pq
import re
import time
import json
import urllib.request
import mysql.connector
from random import shuffle
from urllib.request import Request, urlopen

def on_start(dept, num):
    # course_dept = input('Department: ')
    # course_num = input('Course number: ')
    course_dept = dept
    course_num = num
    print(course_dept)
    print(course_num)
    begin = time.time()
    url = 'https://www.lsa.umich.edu/cg/cg_results.aspx?termArray=f_19_2260&cgtype=ug&show=20&department='
    print('The course you are searching is: ' + course_dept + course_num + '\n\nSearching...\n')
    url += course_dept + '&catalog=' + course_num
    response = urllib.request.urlopen(url)
    html = response.read().decode('utf-8')
    general_page(url, html)
    # quit = False
    # while quit == False:
    # 	print("time: ", time.time() - begin)
    # 	command = input('Enter q to quit: ')
    # 	if command == 'q' or command == 'Q':
    # 		quit = True
    

def general_page(url, html):
    save = {}
    
    doc = pq(html)

    #Course name
    em = doc.find('.row.ClassRow.ClassHyperlink').eq(0)
    # print('The course is also known as: ' + em.find('.col-sm-12 > a > font').text() + '\n')
    course_name = em.find('.col-sm-12 > a > font').text()
    print("course name: ", course_name[1:])
    save['course_code'] = ' '.join(course_name.split()[:2])
    save['course_name'] = ' '.join(course_name.split()[3:])
    em = doc.find('.row.bottompadding_main').eq(1)

    #Credits
    credit = em.find('.col-sm-2').eq(1).text()
    credit = re.search(r'\d', credit).group()
    print('Credit: ' + credit + '\n')
    save['credit'] = credit

    #Instructors
    save['instructor'] = {}
    save['section'] = {}
    sections = list(doc.find('.row.ClassRow.ClassHyperlink').items())
    for i in range(0, len(sections)):
        sec_num = sections[i].find('.col-sm-3').eq(0).text()
        save['instructor'][i] = sections[i].find('.col-sm-3').eq(1).text()
        save['section'][i] = sec_num.split()[1]

    #url
    url = doc.find('.row.ClassRow.ClassHyperlink .toppadding_main .col-sm-12 > a').eq(0).attr.href
    url = 'https://www.lsa.umich.edu/cg/' + url
    detail_page(url, save)

def detail_page(url, save):

    save['lsa_url'] = url

    response = urllib.request.urlopen(url)
    html = response.read().decode('utf-8')
    doc = pq(html)
    
    #Term
    term = doc.find('#contentMain_lblTerm').text()
    print('Term: ', term)
    save['term'] = term
    save['en_prereq'] = None
    save['ad_prereq'] = None
    save['description'] = None

    #Enforced Perequisites
    if doc.find('#contentMain_lblEnfPre').text():
        pre_req = doc.find('#contentMain_lblEnfPre').text()
        print('Enforced Prerequisites: ' + pre_req + '\n')
        save['en_prereq'] = pre_req

    #Advisory Perequisites
    if doc.find('#contentMain_lblAdvPre').text():
        adv_req = doc.find('#contentMain_lblAdvPre').text()
        print('Advisory Prerequisites: ' + adv_req + '\n')
        save['ad_prereq'] = adv_req

    #Course description
    if doc.find('#contentMain_lblDescr p').text():
        descrip = doc.find('#contentMain_lblDescr p').text()
        print('Course description: ' + descrip + '\n')
        save['description'] = descrip
        

    #Sections
    lec_lst = list(doc.find('.row.clsschedulerow.toppadding_main.bottompadding_main').items())[:len(save['section'])]
    assert len(save['section']) == len(lec_lst)
    print('There are %d sections: ' %len(save['section']))
    for i in range(len(lec_lst)):
        section_page(save.copy(), lec_lst[i], save['section'][i], save['instructor'][i])
        
        
def section_page(save, sec_save, section_num, instructor_name):
    score(save, section_num, instructor_name)
    other_save(save, sec_save)
    sql = 'INSERT INTO courses (code, name, term, lsa_url, description, credit, id, section, instructor_name, instructor_score, instructor_url, en_prereq, ad_prereq, status, seats,restricted_seat, waitlist, time, location) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE code=%s, name=%s, term=%s, lsa_url=%s, description=%s, credit=%s, id=%s, section=%s, instructor_name=%s, instructor_score=%s, instructor_url=%s, en_prereq=%s, ad_prereq=%s, status=%s, seats=%s, restricted_seat=%s, waitlist=%s, time=%s, location=%s'
    val = (
        save['course_code'],
        save['course_name'],
        save['term'],
        save['lsa_url'],
        save['description'],
        save['credit'],
        save['id'],
        section_num,
        save['instructor'],
        save['score'],
        save['url'],
        save['en_prereq'],
        save['ad_prereq'],
        save['status'],
        save['seats'],
        save['restricted_seat'],
        save['waitlist'],
        save['time'],
        save['location'],
        save['course_code'],
        save['course_name'],
        save['term'],
        save['lsa_url'],
        save['description'],
        save['credit'],
        save['id'],
        section_num,
        save['instructor'],
        save['score'],
        save['url'],
        save['en_prereq'],
        save['ad_prereq'],
        save['status'],
        save['seats'],
        save['restricted_seat'],
        save['waitlist'],
        save['time'],
        save['location']
    )
    global mycursor
    mycursor.execute(sql, val)
    


def score(save, section_num, instructor_name):
    name = get_name(instructor_name)
    #if no name
    if len(name) == 0:
        score = [0, 0]
        save['instructor'] = None
    elif len(name[0].split()) > 1:
        save['instructor'] = ' '.join(name)
        if get_score(name)[0] > get_score([name[0].split()[0], name[1]])[0]:
            score = get_score(name)
        else:
            score = get_score([name[0].split()[0], name[1]])
    else:
        save['instructor'] = ' '.join(name)
        score = get_score(name)
    if not name:
        save['instructor'] = None
        print('Section %s\'s instructor savermation is currently unavailable' %section_num)
    else:
        print("Section %s\'s instructor: " %section_num + name[0] + ' ' + name[1])
        if score[0] == 0:
            print("Cannot find the instructor on ratemyprofessors.com")
        else:
            print('Ratemyprofessors score: %s' %score[0])
            print('URL: ' + score[1])
    if score[0] == 0:
        save['score'] = None
        save['url'] = None 
    else:
        save['score'] = score[0]
        save['url'] = score[1]


def get_name(instructor_name):
    name = []
    if instructor_name:
        name_string = instructor_name.split('\n')[1]
        #Middle name
        if len(name_string.split()) > 1 and len(name_string.split()[1]) == 1:
            flip_string = instructor_name.split()[1]
            name = [flip_string.split(',')[1], flip_string.split(',')[0]]
        else:
            name = [name_string.split(',')[1], name_string.split(',')[0]]
    return name


def get_score(name_list):
    if len(name_list) > 1:
        save = '+'
        save = save.join(name_list).replace(' ', '+')
        url = 'http://www.ratemyprofessors.com/search.jsp?query=' + save
        print("Instructor url: ", url)
        req = Request(url, headers={'User-Agent': 'Mizilla/5.0'})
        doc = pq(urlopen(req).read().decode('utf-8'))
        for each in doc.find('.listing').items():
            if re.search('University of Michigan', each.text()):
                url = 'http://www.ratemyprofessors.com' + each.find('a').attr.href
                return_lst = [score_page(url)]
                return_lst.append(url)
                return return_lst
    return [0, 0]


def score_page(url):
    req = Request(url, headers={'User-Agent': 'Mizilla/5.0'})
    html = urlopen(req).read().decode('utf-8')
    doc = pq(html)
    if doc.find('.breakdown-container > div > div').text():
        return float(doc.find('.breakdown-container > div > div').text())
    return 0

def other_save(save, sec_save):
    #Class number
    class_no = sec_save.find('.col-md-1').eq(2).text().split()[2]
    print('Class number: ' + class_no)
    save['id'] = class_no

    #Enroll stat
    stat = sec_save.find('.col-md-1').eq(3).find('.badge').text()
    print('Enroll status: ' + stat)
    save['status'] = stat

    #Open seats
    seat_num = sec_save.find('.col-md-1').eq(4).text().split()[2]
    print('Open seats: ' + seat_num)
    save['seats'] = seat_num

    save['restricted_seat'] = None
    #Open restricted seats
    if len(sec_save.find('.col-md-2').text().split()) == 4:
        rtrit_seat = sec_save.find('.col-md-2').text().split()[3]
        print('Open restricted seats: ' + rtrit_seat)
        save['restricted_seat'] = rtrit_seat

    #Waitlist
    waitlist = sec_save.find('.col-md-1').eq(5).text().split()[2]
    print('Waitlist: ' + waitlist)
    save['waitlist'] = waitlist if waitlist != '-' else None

    #Day/Time
    day = sec_save.find('.col-md-4 .MPCol_Day').text()
    time = sec_save.find('.col-md-4 .MPCol_Time').text()
    print('Day/Time: ' + day + ' ' + time)
    save['time'] = day + ' ' + time

    #Location
    location = sec_save.find('.col-md-4 .loc_link').text()
    print('Location: ' + location)
    save['location'] = location

if __name__ == "__main__":
    with open('../../shared/all_course_name_list.json') as f:
        data = json.load(f)
    name_list = data['name_list']
    print(name_list)
    # shuffle(name_list)

    mydb = mysql.connector.connect(
        host="courses-info-public.cbq3qnmq2ztg.us-east-2.rds.amazonaws.com",
        user="ivanpu",
        passwd="Ivanpu77",
        database='courses_info'
    )
    mycursor = mydb.cursor()
    # for course in name_list:
    #     course = course.split()
    #     print(course)
    #     on_start(course[0], course[1])
    #     mydb.commit()

    on_start('EECS', '485')
    mydb.commit()

    mycursor.execute("SELECT * FROM courses WHERE code='EECS 485'")
    myresult = mycursor.fetchall()
    for result in myresult:
        print(result)
    print(len(myresult))