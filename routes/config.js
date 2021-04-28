const users = [
    {
        "id": 1,
        "username": "root",
        "password": "root123...",
        "firstName": "system",
        "lastName": "root",
        "email": "root@superuser.com",
        "gender": "unknown",
        "privilege": 2,
        "active": true,
    },
    {
        "id": 2,
        "username": "superuser",
        "password": "super123...",
        "firstName": "H",
        "lastName": "L",
        "email": "hl@superuser.com",
        "gender": "male",
        "privilege": 2,
        "active": true,
    },
    {
        "id": 3,
        "username": "superuser",
        "password": "super123...",
        "firstName": "H",
        "lastName": "L",
        "email": "hl@superuser.com",
        "gender": "male",
        "privilege": 2,
        "active": true,
    },
    {
        "id": 4,
        "username": "lecture1",
        "password": "lecture123...",
        "firstName": "John",
        "lastName": "Harrison",
        "email": "jh@lecture.com",
        "gender": "male",
        "privilege": 1,
        "active": true,
    },
    {
        "id": 5,
        "username": "student1",
        "password": "student123...",
        "firstName": "Chris",
        "lastName": "Evens",
        "email": "ce@student.com",
        "gender": "male",
        "privilege": 0,
        "active": true,
    },
];

const modules = [
    {
        "id": 1,
        "moduleName": "Web Development 1",
        "fullMark": 100,
        "active": true,
    },
    {
        "id": 2,
        "moduleName": "Databases 1",
        "fullMark": 100,
        "active": true,
    },
    {
        "id": 3,
        "moduleName": "Rich Internet Application 2",
        "fullMark": 100,
        "active": true,
    },
    {
        "id": 4,
        "moduleName": "Lecture on Web 2",
        "fullMark": 100,
        "active": true,
    },
];

const grades = [
    {
        "id": 1,
        "uid": 5,
        "mid": 1,
        "grade": 50,
        "year": 2019,
        "semester": 1,
    },
    {
        "id": 2,
        "uid": 5,
        "mid": 2,
        "grade": 50,
        "year": 2020,
        "semester": 2,
    },
    {
        "id": 3,
        "uid": 5,
        "mid": 3,
        "grade": 50,
        "year": 2021,
        "semester": 1,
    },
    {
        "id": 3,
        "uid": 5,
        "mid": 4,
        "grade": 50,
        "year": 2021,
        "semester": 2,
    },

];

const years = [2019, 2020, 2021];

const semesters = [1, 2];

module.exports = {users, modules, grades, years, semesters};