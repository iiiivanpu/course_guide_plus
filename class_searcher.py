#from selenium import webdriver
from pyquery import PyQuery as pq
import re
import time
import urllib.request
from urllib.request import Request, urlopen

def on_start():
	course_dept = input('Department: ')
	course_num = input('Course number: ')
	begin = time.time()
	url = 'https://www.lsa.umich.edu/cg/cg_results.aspx?termArray=w_19_2220&cgtype=ug&show=20&department='
	print('The course you are searching is: ' + course_dept + course_num + '\n\nSearching...\n')
	url += course_dept + '&catalog=' + course_num
	response = urllib.request.urlopen(url)
	html = response.read().decode('utf-8')
	general_page(html)
	quit = False
	while quit == False:
		print("time: ", time.time() - begin)
		command = input('Enter q to quit: ')
		if command == 'q' or command == 'Q':
			quit = True
    

def general_page(html):
	doc = pq(html)

	#Course name
	em = doc.find('.row.ClassRow.ClassHyperlink').eq(1)
	print('The course is also known as: ' + em.find('.col-sm-12 > a > font').text() + '\n')
	em = doc.find('.row.bottompadding_main').eq(1)

	#Credits
	credit = em.find('.col-sm-2').eq(1).text()
	credit = re.search(r'\d', credit).group()
	print('Credit: ' + credit + '\n')

	#Instructors
	save = {
		'instructor': {},
		'section': {}
	}
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

	response = urllib.request.urlopen(url)
	html = response.read().decode('utf-8')
	doc = pq(html)

	#Term
	print('Term: ' + doc.find('#contentMain_lblTerm').text() + '\n')

	#Enforced Perequisites
	if doc.find('#contentMain_lblEnfPre').text():
		pre_req = doc.find('#contentMain_lblEnfPre').text()
		print('Enforced Perequisites: ' + pre_req + '\n')

	#Advisory Perequisites
	if doc.find('#contentMain_lblAdvPre').text():
		adv_req = doc.find('#contentMain_lblAdvPre').text()
		print('Advisory Prerequisites: ' + adv_req + '\n')

	#Course description
	if doc.find('#contentMain_lblDescr p').text():
		descrip = doc.find('#contentMain_lblDescr p').text()
		print('Course description: ' + descrip + '\n')

	#Sections
	lec_lst = list(doc.find('.row.clsschedulerow.toppadding_main.bottompadding_main').items())[:len(save['section'])]
	assert len(save['section']) == len(lec_lst)
	print('There are %d sections: ' %len(save['section']))
	for i in range(len(lec_lst)):
		section_page(lec_lst[i], save['section'][i], save['instructor'][i])
		
def section_page(sec_info, section_num, instructor_name):
	score(sec_info, section_num, instructor_name)
	other_info(sec_info)
	print('\n\n')


def score(sec_info, section_num, instructor_name):
	name = get_name(instructor_name)
	if len(name) == 0:
		score = [0, 0]
	elif len(name[0].split()) > 1:
		if get_score(name)[0] > get_score([name[0].split()[0], name[1]])[0]:
			score = get_score(name)
		else:
			score = get_score([name[0].split()[0], name[1]])
	else:
		score = get_score(name)
	if not name:
		print('Section %s\'s instructor information is currently unavailable' %section_num)
	else:
		print("Section %s\'s instructor: " %section_num + name[0] + ' ' + name[1])
		if score[0] == 0:
			print("Cannot find the instructor on ratemyprofessors.com")
		else:
			print('Ratemyprofessors score: %s' %score[0])
			print('URL: ' + score[1])


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
		info = '+'
		info = info.join(name_list).replace(' ', '+')
		url = 'http://www.ratemyprofessors.com/search.jsp?query=' + info
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

def other_info(sec_info):
	#Class number
	class_no = sec_info.find('.col-md-1').eq(2).text().split()[2]
	print('Class number: ' + class_no)

	#Enroll stat
	stat = sec_info.find('.col-md-1').eq(3).find('.badge').text()
	print('Enroll status: ' + stat)

	#Open seats
	seat_num = sec_info.find('.col-md-1').eq(4).text().split()[2]
	print('Open seats: ' + seat_num)

	#Open restricted seats
	if len(sec_info.find('.col-md-2').text().split()) == 4:
		rtrit_seat = sec_info.find('.col-md-2').text().split()[3]
		print('Open restricted seats: ' + rtrit_seat)

	#Waitlist
	waitlist = sec_info.find('.col-md-1').eq(5).text().split()[2]
	print('Waitlist: ' + waitlist)

	#Day/Time
	day = sec_info.find('.col-md-4 .MPCol_Day').text()
	time = sec_info.find('.col-md-4 .MPCol_Time').text()
	print('Day/Time: ' + day + ' ' + time)

	#Location
	location = sec_info.find('.col-md-4 .loc_link').text()
	print('Location: ' + location)

on_start()