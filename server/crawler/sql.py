import mysql.connector


CREATE TABLE courses (
    code VARCHAR(15),
    name VARCHAR(100),
    term VARCHAR(10),
    lsa_url VARCHAR(200),
    description VARCHAR(500), 
    credit INT, 
    id INT PRIMARY KEY, 
    section VARCHAR(5),
    instructor_name VARCHAR(30), 
    instructor_score FLOAT(2,1), 
    instructor_url VARCHAR(100), 
    en_prereq VARCHAR(255), 
    ad_prereq VARCHAR(255), 
    status VARCHAR(8), 
    seats INT, 
    restricted_seat INT,
    waitlist INT, 
    time VARCHAR(30), 
    location VARCHAR(50));


mydb = mysql.connector.connezhiudact(
    host="localhost",
    user="root",
    passwd="",
    database='courses_info'
)

mycursor = mydb.cursor()

# mycursor.execute("CREATE DATABASE courses_info")

sql = 'INSERT INTO courses (name, term, id, instructor_name, instructor_score, instructor_url, en_prereq, ad_prereq, description, status, seats, waitlist, time, location) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE instructor_score=%s, status=%s, seats=%s, waitlist=%s'
val = ('EECS281', 'FALL 2019', 23069, 'Marcus Darden', 4.5,  'http://www.ratemyprofessors.com/ShowRatings.jsp?tid=1991134','EECS 280; and one of EECS 203, or MATH 465 or 565; each completed with a minimum grade of C or better.','', ' Introduction to algorithm analysis and O-notation; Fundamental data structures including lists, stacks, queues, priority queues, hash tables, binary trees, search trees, balanced trees and graphs; searching and sorting algorithms; recursive algorithms; basic graph algorithms; introduction to greedy algorithms and divide and conquer strategy. Several programming assignments.', 'open', 6, 0, 'TuTh 9:00AM - 10:30AM', '1670', 4.6, 'Closed', 0, 100)
mycursor.execute(sql, val)
mydb.commit()

mycursor.execute("SELECT * FROM courses")

myresult = mycursor.fetchall()

print(len(myresult))
for x in myresult:
    print(x)
