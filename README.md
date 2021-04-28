# ERQS Client
28 April 2021

> Exam Record Query System - Client

# 1 Project Config

## API Server

- User Java 1.8 (231)

- Use maven
- Use Spring boot configuration

## Front-end Server

```
package.json: ~/WebstormProjects/exam-record-query-system-client/package.json

command: run

scripts: dev

Node interpreter: Project (default)
```

## SQL

Follow the sql scripts.

Entities

- User
- Module
- Grade



# 2 System Structure

|        | Front-end                     | Back-end          | DataBase |
| ------ | ----------------------------- | ----------------- | -------- |
| Client | JavaScript, jQuery, Bootstrap | /                 | /        |
| Server | NodeJS, ExpressJS, PugJS      | Java, Spring Boot | MySQL    |
|        |                               |                   |          |
|        |                               |                   |          |
|        |                               |                   |          |

# 3 Back-end development

## Difference between RESTful API and RPC

This statement of Roy Fielding’s may further lend a clue to the difference between **REST** and **RPC**:

> I am getting frustrated by the number of people calling any  HTTP-based interface a REST API. Today’s example is the SocialSite REST  API. That is RPC. It screams RPC. There is so much coupling on display  that it should be given an X rating.
>
> What needs to be done to make the REST architectural style clear on  the notion that hypertext is a constraint? In other words, if the engine of application state (and hence the API) is not being driven by  hypertext, then it cannot be RESTful and cannot be a REST API. Period.  Is there some broken manual somewhere that needs to be fixed?

— [Roy Fielding]( https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven)

## Spring MVC

## Spring Boot

### Annotation

`@SpringBootApplication` is a meta-annotation that pulls in **component scanning**, **autoconfiguration**, and **property support**. We won’t dive into the details of Spring Boot in this tutorial, but in  essence, it will fire up a servlet container and serve up our service.

`@RestController` indicates that the data returned by each  method will be written straight into the response body instead of  rendering a template.

## Spring HATEOAS



## JPA



# 4 Database settings

Tables

- User
- Module
- Record(relation)



## 4.1 Design

### User

| Field     | Type     | Definition |
| --------- | -------- | ---------- |
| id        | Auto Int |            |
| username  | String   |            |
| password  | String   |            |
| firstName | String   |            |
| lastName  | String   |            |
| email     | String   |            |
| gender    | String   |            |
| privilege | int      | 0, 1, 2    |
| active    | boolean  |            |

### Module

| Field     | Type     | Definition |
| --------- | -------- | ---------- |
| id        | Auto Int |            |
| name      | String   |            |
| fullGrade | Float    |            |
| active    | boolean  |            |
|           |          |            |
|           |          |            |

### Grade

| Field    | Type     | Definition |
| -------- | -------- | ---------- |
| id       | Auto int |            |
| uId      | Auto int |            |
| mId      | Auto int |            |
| garde    | float    |            |
| year     | int      |            |
| semester | int      |            |
| active   | boolean  |            |



# Reference

- RESTful API - SpringBoot

  https://spring.io/guides/tutorials/rest/

- JPA - MySQL

  https://spring.io/guides/gs/accessing-data-mysql/

- Working with Spring Data Repositories

  https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories
