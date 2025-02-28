# Node.js E-Commerce API

## 📄 Introduction

Node.js E-Commerce API, a backend service for an e-commerce application. It provides endpoints for managing users, products, categories, and orders. The API is built with Node.js, Express, and MongoDB.

Project still under development. Next step: Transition to TypeScript before any further additions.

## 🛰️ Technologies Used

- **Node.js**: JavaScript runtime environment used to execute server-side code.
- **Express**: Fast and minimalist web framework for Node.js.
- **MongoDB**: Non-relational document database for agile development.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js to manage data.

## 🗂️ Project Structure

```
node-ecommerce-api/
|── node_modules/...
│── public/
│   ├── images/
│   ├── uploads/
│── src/
│   ├── config/
│   │   ├── dbConnection.js
│   │   ├── unProtectedPaths.js
│   ├── controllers/
│   │   ├── categories.controller.js
│   │   ├── orders.controller.js
│   │   ├── products.controller.js
│   │   ├── users.controller.js
│   ├── helpers/
│   │   ├── jwt.js
│   │   ├── uploadImage.js
│   ├── models/
│   │   ├── Category.model.js
│   │   ├── Order.model.js
│   │   ├── OrderItem.model.js
│   │   ├── Product.model.js
│   │   ├── User.model.js
│   ├── routes/
│   │   ├── categories.routes.js
│   │   ├── orders.routes.js
│   │   ├── products.routes.js
│   │   ├── users.routes.js
│   ├── utils/
│   │   ├── apiUrl.js
│   │   ├── validateEnvVariables.js
│   ├── server.js
│── .env
│── .gitignore
│── LICENSE
│── package-lock.json
│── package.json
│── README.md
```

## 📋 Installation Guide

### Prerequisites

- Node.js (latest LTS version)
- MongoDB (local or cloud instance)

### Cloning the Repository

```sh
git clone https://github.com/MartinXCVI/node-ecommerce-api.git
cd node-ecommerce-api
```

### Install Dependencies

```sh
npm install
```

### Environment Variables (.env)

Create a `.env` file in the root directory and configure the following variables:

```
API_URL=/api/v1
DB_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster_name>.cekcm.mongodb.net/<database_name>?retryWrites=true&w=majority&appName=<cluster_name>
SALT_ROUNDS=<number_of_rounds>
ACCESS_TOKEN_SECRET=<your_access_token_secret>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
```

### Running the Project

- Start the server:

```sh
npm start
```

- Start the server in development mode (with nodemon):

```sh
npm run dev
```

## 📦 Dependencies

### Main Dependencies

- **bcrypt**: Library for hashing passwords.
- **body-parser**: Middleware to parse incoming request bodies.
- **cookie-parser**: Middleware to parse cookies.
- **cors**: Middleware to enable Cross-Origin Resource Sharing (CORS).
- **dotenv**: Loads environment variables from a `.env` file.
- **express**: Minimalistic web framework for Node.js.
- **express-jwt**: Middleware for handling JWT authentication.
- **jsonwebtoken**: Library for generating and verifying JWTs.
- **mongoose**: ODM for MongoDB to manage data.
- **morgan**: HTTP request logger middleware.
- **multer**: Middleware for handling file uploads.

### Development Dependencies

- **nodemon**: Utility for automatically restarting the server during development.

## 📚 Learn More

- [Node.js latest documentation](https://nodejs.org/docs/latest/api/)
- [Nodemon project website](https://nodemon.io/)
- [Getting started with Express.js](https://expressjs.com/en/starter/installing.html)
- [Dotenv repository](https://github.com/motdotla/dotenv#readme)
- [MongoDB documentation](https://www.mongodb.com/docs/)
- [Mongoose documentation](https://mongoosejs.com/docs/)
- [bcrypt NPM package](https://www.npmjs.com/package/bcrypt)
- [Multer repository](https://github.com/expressjs/multer)
- [body-parser NPM package ](https://www.npmjs.com/package/body-parser)
- [cookie-parser NPM package](https://www.npmjs.com/package/cookie-parser)
- [Cross Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [express-jwt NPM package](https://www.npmjs.com/package/express-jwt)
- [JSON Web Tokens official website's introduction](https://jwt.io/introduction)
- [Morgan NPM package](https://www.npmjs.com/package/morgan)

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 🧑‍💻 Developer

- [**MartinXCVI**](https://github.com/MartinXCVI)