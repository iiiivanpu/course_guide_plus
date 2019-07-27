### Course  Guide Plus Project

---
SQL structure

```sql
CREATE TABLE courses (
    code VARCHAR(15),
    name VARCHAR(100),
    term VARCHAR(10),
    lsa_url VARCHAR(200),
    description VARCHAR(5000), 
    credit INT, 
    id INT PRIMARY KEY, 
    section VARCHAR(5),
    instructor_name VARCHAR(50), 
    instructor_score FLOAT(2,1), 
    instructor_url VARCHAR(100), 
    en_prereq VARCHAR(1000), 
    ad_prereq VARCHAR(1000), 
    status VARCHAR(8), 
    seats INT, 
    restricted_seat INT,
    waitlist INT, 
    time VARCHAR(100), 
    location VARCHAR(50));
```
Change the password for root user
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
```




