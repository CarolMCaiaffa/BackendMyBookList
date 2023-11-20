# BACKEND MyBookList

To start the server, use: npm start

## Node.js: Express + Mongo cloud DB

## Installation
You will need Node, in the project I used LTS: 20.9.0 (includes npm 10.1.0).

```bash
npm i
```

run server
```
npm start
```
run server development
```
npm dev
```
## Dependencies

The project has the following dependencies:

```json
"dependencies": {
    "@netlify/functions": "^2.4.0",
    "@types/express": "^4.17.21",
    "bcrypt": "^5.1.1",
    "connect-mongodb-session": "^3.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "mongoose": "^8.0.0",
    "serverless-http": "^3.2.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
```
## About the App

This is the backend code of the MyBookList App where users can have an account to store and edit a list of books. They can also see a general list of all users' books.

In the app, users can register and log in. After logging in, they can access the general list of books from their profile. There is a tab for adding books with references, title, author, genre, description, year, and a numerical rating from 0 to 5. 

Users can view this list of books in their profile, edit the data, delete the books they no longer want, and log out of the app.

### manual API testing

For manual testing, https://hoppscotch.io/ was used.

once opened import the file `./Backend/hoppscotch-collection-of-api-calls.json` which contains a collection of API calls
for this use the API_KEY that is configured in the .env file