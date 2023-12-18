
# Admission Management Application
A full-stack application where user can register for yoga classes, and the admin can manage these users and the batches. 

It has many features which are all listed in the Backend API References below.

## Tech-Stack used
React.js, Express.js, Node.js, HTML, CSS, SQL

## Backend API References
### For the Admin:
#### 1. To Fetch all the users

```http
  GET /getUsers
```
#### 2. To Fetch all the users with pending payment

```http
  GET /getUsersWithPendingPayment
```
#### 3. To Fetch all the users who have completed the payment

```http
  GET /getUsersWithCompletedPayment
```
#### 4. To Fetch all the users of a particular batch

```http
  GET /getUsersofBatch/:batch_id
```

### For the users:
#### 5. To change their batch

```http
  PUT /changeBatch
```
#### 6. To do payment

```http
  GET /submitPayment/:user_name
```
#### 7. To delete the user
```http
  GET /deleteUser/:user_name
```
#### 8. Login
```http
  POST /login
```
#### 9. To fetch all the available Batches.
```http
  GET /getBatches
```
#### 10. To get the details of a user
```http
  GET /getUserDetails/:user_name
```
#### 10. To get register a new user
```http
  POST /addUser
```
## Assumptions and Constraints
1. Only people within the age limit of 18-65 can enroll.
2. A user will have to pay the fees every month. So the payment status automatically gets reset to "pending" at the first day of each month for all the users. A user can complete the payment at any day of the month.
3. There are a total of 4 batches a day namely 6-7AM, 7-8AM, 8-9AM and 5-6PM. A user can only change the batch at the first day of the next month.

## Entity-Relationship (ER) Diagram
### Entities:
TABLE 1 Users:
| COLUMN NAME | TYPE | CONSTRAINTS |
| :-------- | :-----------| :----------------|
| `user_id` | SERIAL | PRIMARY KEY |
| `user_name` | VARCHAR(255) | UNIQUE, NOT NULL | 
| `user_pswd` | VARCHAR(255) | NOT NULL |
| `batch_id` | INT | FOREIGN KEY(references "Batches" at batch_id)|
| `enrollment_date` | DATE |  NOT NULL |
| `last_payment_date` | DATE | NOT NULL |
| `payment_status` | VARCHAR(20) | DEFAULT 'pending'|

TABLE 2 Batches:
| COLUMN NAME | TYPE | CONSTRAINTS |
| :-------- | :-----------| :----------------|
| `batch_id` | SERIAL | PRIMARY KEY |
| `batch_time` | VARCHAR(20) | UNIQUE, NOT NULL |


The batch_id is the Foreign key of the Users table and the Primary key of the Batches table.

### Relationships:
"Users" and "Batches" have a *Many-to-One* relationship (each user belongs to one batch, but a batch can have multiple users).

## Webpages and Screenshots of the Frontend:
1. Login Page:
   
![Screenshot_20231218_221146](https://github.com/t4nm4y/admissionMgmt/assets/88146479/04925eed-6e67-4fc7-907d-bf050fa4c3cb)

   
2. Home Page:
   
![Screenshot_20231218_221206](https://github.com/t4nm4y/admissionMgmt/assets/88146479/859835dc-e0f6-4385-bb7e-b85ac5d14c89)


3. Admin Page:
   
![Screenshot_20231218_221241](https://github.com/t4nm4y/admissionMgmt/assets/88146479/4e87f831-e8e0-4cff-8f1a-38b156d5fa19)

![Screenshot_20231218_221259](https://github.com/t4nm4y/admissionMgmt/assets/88146479/15625d33-8589-46bc-8180-9dddfc91db0f)


4. Add New User Page:

![Screenshot_20231218_221347](https://github.com/t4nm4y/admissionMgmt/assets/88146479/2e469c1e-99de-4453-adf9-65f443ee4aef)


### Made with ❤️ by Tanmay Kumar.

