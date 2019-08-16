from pyquery import PyQuery as pq
import re
import json
import urllib.request
from urllib.request import Request, urlopen

name_set = {}
count = 0

def get_names():
    
    # levels = ["100", "200", "300", "400", "500,600,700,800,900"]
    url = "https://www.lsa.umich.edu/cg/cg_results.aspx?termArray=f_19_2260&cgtype=ug&show=80&numlvl=100,200,300,400,500,600,700,800,900"
    response = urllib.request.urlopen(url)
    html = response.read().decode('utf-8')
    parse_page(html)

   
def parse_page(html):
    global count, name_set
    doc = pq(html)
    em = doc.find('.row.ClassRow.ClassHyperlink')

    for i in range(len(em)):
        # print(em.eq(i))
        course_name = em.eq(i).find('.col-sm-12 > a > font').text()
        course_name = course_name.split()
        course_code = course_name[:2]
        course_name = course_name[3:]
        count += 1
        print(" ".join(course_code))
        print(" ".join(course_name))
        # name_set.add(" ".join(course_name))
        name_set[" ".join(course_code)] = " ".join(course_name)
    print(count)
    next_url = doc.find('#contentMain_hlnkNextBtm')
    if next_url:
        url = 'https://www.lsa.umich.edu/cg/' + next_url.attr.href
        response = urllib.request.urlopen(url)
        html = response.read().decode('utf-8')
        parse_page(html)
    return
    

if __name__ == '__main__':
    get_names()
    print(name_set)
    json_file = {"name_list": list(name_set)}
    with open('../../../client/src/constants/all_course_name_list.json', 'w') as outfile:
        json.dump(json_file, outfile)
    print("Number of classes:", len(name_set))