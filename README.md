# Cloud-6225-WebApp

Web application developed with NodeJS and Express with MySQL as the database to store all the user data. Sequelize ORM is used to manage the MySQL database without the need to type excessive SQL code. 

## The API consist of 3 requests: 

POST: Used to create a new user
GET : Used to retrieve user data with authentication
PUT: Used to update user data with authentication

## The web application has the functionality to perform the following functions:

### 1. Create a new user

As a user, An account is created by providing the following information.
1. Email Address
2. Password
3. First Name
4. Last Name

### 2. Retrieve a user

As a user, an account can be retrieved using basic authentication with username and password

### 3. Update a user

As a user, an account can be updated using basic authentication with username and password

Only the following data can be updated:
1. First Name
2. Last Name
3. Password

## Pre-requisites / Requirements

1. NodeJS
2. Express
3. mysql2
4. sequelize
5. bcrypt
6. basic-auth
7. email-validator
8. body-parser
9. dotenv
10. nodemon

## Building the application

1. Open a git supported terminal
2. Clone the application repository 
     `git clone https://github.com/username/gitrepo_name`
3. Navigate to the cloned folder using 
     `cd directory_name`
4. Initialize the node environment using
     `npm init`
5. Install the packages mentioned above using 
     `npm i --save packagename`
6. Install nodemon globally using
     `npm i -g nodemon`
7. Create a database using SQL workbench 
8. Create a new .env file and supply the following information
    1. Database Host
    2. Database Name
    3. Database Password
    4. Database User
    5. Server Host
9.  Run the application using
     `npm start`

## Running the application

1. Once the application starts running, open Postman to run the API requests
   
2. To create a user, set the address to **localhost:3000/users** and provide the following data in json format
   ```
   username: "xxx@yyy.com"
   firstName: "xxx"
   lastName: "yyy"
   password: "xxxyyy"
   ```

3. To get a user, 
    1. Set the address to **localhost:3000/users/self** 
    2. In Authorization tab, select Basic auth and provide username and password 
    3. Send the GET request to retrieve user data
   
4. To update a user,
    1. Set the address to **localhost:3000/users/self**
    2. In Authorization tab, select Basic auth and provide username and password
    3. provide the necessary data to be updated in json format
      ```
      firstName: "xxx"
      lastName: "yyy"
      password: "xxxyyyzzz"
      ```
5. To run test cases for the application, enter the following in the terminal,
     `npm test`
   