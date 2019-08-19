 #!/usr/bin/env python
# -*- encoding: utf-8 -*-
# Created on 2019-08-17 10:09:31
# Project: Couses_info

from pyspider.libs.base_handler import *
import mysql.connector
import json
import re
from pyquery import PyQuery as pq
from urllib.request import Request, urlopen
mydb = mysql.connector.connect(
            host="courses-info-public.cbq3qnmq2ztg.us-east-2.rds.amazonaws.com",
            user="ivanpu",
            passwd="Ivanpu77",
            database='courses_info'
        )
mycursor = mydb.cursor()

class Handler(BaseHandler):
    
    @every(minutes=12 * 60)
    def on_start(self):
        with open('/mnt/c/Users/iconv/g_drive/cs/course_guide_plus/client/src/constants/all_course_name_list.json') as f:
            data = json.load(f)
        name_list = list(data.keys())
        name_list = ['EECS 281']
        
        url = 'https://www.lsa.umich.edu/cg/cg_results.aspx?termArray=f_19_2260&cgtype=ug&show=20&department='
        for course in name_list:
            course = course.split()
            self.crawl(url+course[0]+'&catalog='+course[1], callback=self.index_page)

    @config(age=12 * 60 * 60)
    def index_page(self, response):
        save = {}
        em = response.doc('.row.ClassRow.ClassHyperlink').eq(0)
        
        course_name = em.find('.col-sm-12 > a > font').text()
        save['course_code'] = ' '.join(course_name.split()[:2])
        save['course_name'] = ' '.join(course_name.split()[3:])

        em = response.doc('.row.bottompadding_main').eq(1)
        credit = em.find('.col-sm-2').eq(1).text()
        credit = re.search(r'\d', credit).group()
        save['credit'] = credit

        save['instructor'] = []
        save['section'] = []
        sections = list(response.doc('.row.ClassRow.ClassHyperlink').items())
        for i in range(0, len(sections)):
            sec_num = sections[i].find('.col-sm-3').eq(0).text()
            save['instructor'].append(sections[i].find('.col-sm-3').eq(1).text())
            save['section'].append(sec_num.split()[1])

        url = response.doc('.toppadding_main .col-sm-12 > a').eq(0).attr.href
        save['lsa_url'] = url
        print(save)
        self.crawl(url, callback=self.info_page, save=save, connect_timeout=600, timeout=600)
    
    @config(age=12 * 60 * 60)
    def info_page(self, response):
        save = response.save

        save['term'] = response.doc('#contentMain_lblTerm').text()
        save['en_prereq'] = None
        save['ad_prereq'] = None
        save['description'] = None

        if response.doc('#contentMain_lblEnfPre').text():
            pre_req = response.doc('#contentMain_lblEnfPre').text()
            save['en_prereq'] = pre_req

        if response.doc('#contentMain_lblAdvPre').text():
            adv_req = response.doc('#contentMain_lblAdvPre').text()
            save['ad_prereq'] = adv_req

        if response.doc('#contentMain_lblDescr p').text():
            descrip = response.doc('#contentMain_lblDescr p').text()
            save['description'] = descrip

        lec_lst = list(response.doc('.row.clsschedulerow.toppadding_main.bottompadding_main').items())[:len(save['section'])]
        
        for i in range(len(lec_lst)):
            this_save = save.copy()
            self.other_info(this_save, lec_lst[i])
            this_save['section'] = this_save['section'][i]
            this_save['name'] = self.get_name(this_save['instructor'][i]) 
            self.crawl("https://google.com/search?q=" + this_save['course_code'].replace(" ", "+") + '+' + str(i), callback=self.timeout_page, save=this_save, connect_timeout=600, timeout=600)
                        
    @config(age=12 * 60 * 60)
    def timeout_page(self, response):
        this_save = response.save
        name = this_save['name']
        this_save['score'] = []
        this_save['url'] = []
        if len(name) == 0:
            score = [0, 0]
            this_save['instructor'] = None
            this_save['score'] = None
            this_save['url'] = None
        elif len(name[0].split()) > 1:
            this_save['instructor'] = ' '.join(name)
            if self.get_score(name)[0] > self.get_score([name[0].split()[0], name[1]])[0]:
                score = self.get_score(name)
            else:
                score = self.get_score([name[0].split()[0], name[1]])
        else:
            this_save['instructor'] = ' '.join(name)
            score = self.get_score(name)
        if score[0] == 0:
            this_save['score'] = None
            this_save['url'] = None 
        else:
            this_save['score'] = score[0]
            this_save['url'] = score[1]
        
        self.crawl(response.url+'save', callback=self.detail_page, save=this_save, connect_timeout=600, timeout=600)
        

    def get_name(self, instructor_name):
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
    
    def score_page(self, url):
        req = Request(url, headers={'User-Agent': 'Mizilla/5.0'})
        html = urlopen(req).read().decode('utf-8')
        doc = pq(html)
        if doc.find('.breakdown-container > div > div').text():
            return float(doc.find('.breakdown-container > div > div').text())
        return 0

    def get_score(self, name_list):
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
                    return_lst = [self.score_page(url)]
                    return_lst.append(url)
                    return return_lst
        return [0, 0]

    def other_info(self, save, sec_save):
        #Class number
        class_no = sec_save.find('.col-md-1').eq(2).text().split()[2]
        save['id'] = class_no

        #Enroll stat
        stat = sec_save.find('.col-md-1').eq(3).find('.badge').text()
        save['status'] = stat

        #Open seats
        seat_num = sec_save.find('.col-md-1').eq(4).text().split()[2]
        save['seats'] = seat_num

        save['restricted_seat'] = None
        #Open restricted seats
        if len(sec_save.find('.col-md-2').text().split()) == 4:
            rtrit_seat = sec_save.find('.col-md-2').text().split()[3]
            save['restricted_seat'] = rtrit_seat

        #Waitlist
        waitlist = sec_save.find('.col-md-1').eq(5).text().split()[2]
        save['waitlist'] = waitlist if waitlist != '-' else None

        #Day/Time
        day = sec_save.find('.col-md-4 .MPCol_Day').text()
        time = sec_save.find('.col-md-4 .MPCol_Time').text()
        save['time'] = day + ' ' + time

        #Location
        location = sec_save.find('.col-md-4 .loc_link').text()
        save['location'] = location

    @config(age=12 * 60 * 60)
    def detail_page(self, response):
        print(response.save)
        save = response.save
        sql = 'INSERT INTO courses (code, name, term, lsa_url, description, credit, id, section, instructor_name, instructor_score, instructor_url, en_prereq, ad_prereq, status, seats,restricted_seat, waitlist, time, location) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE code=%s, name=%s, term=%s, lsa_url=%s, description=%s, credit=%s, id=%s, section=%s, instructor_name=%s, instructor_score=%s, instructor_url=%s, en_prereq=%s, ad_prereq=%s, status=%s, seats=%s, restricted_seat=%s, waitlist=%s, time=%s, location=%s'
        val = (
        save['course_code'],
        save['course_name'],
        save['term'],
        save['lsa_url'],
        save['description'],
        save['credit'],
        save['id'],
        save['section'],
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
        save['section'],
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
        global mycursor, mydb
        mycursor.execute(sql, val)
        mydb.commit()
        return response.save

    # def on_result(self,result):
    #     print(result)
    #     mydb = mysql.connector.connect(
    #         host="courses-info-public.cbq3qnmq2ztg.us-east-2.rds.amazonaws.com",
    #         user="ivanpu",
    #         passwd="Ivanpu77",
    #         database='courses_info'
    #     )
    #     mycursor = mydb.cursor()

    #     mydb.commit()