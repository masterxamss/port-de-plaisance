# Port de la Plaisance de Russell

A Node.js API project for managing catways and reservations at the Port de la Plaisance de Russell. This project is part of a school assignment and includes a backend implementation with MongoDB, user authentication, and comprehensive testing.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Features
- **Catway Management**: Create, update, delete, and list catways.
- **Reservation Management**: Handle reservations for catways.
- **Authentication**: Secure endpoints with user authentication.
- **Error Handling**: Includes secure error messages that avoid exposing sensitive data.
- **Testing**: Unit tests written in Mocha and Chai.
- **Documentation**: Automatically generated with JSDoc.

---

## Technologies Used
- **Node.js**: JavaScript runtime environment.
- **Express**: Web application framework.
- **MongoDB**: Database for storing catways and reservations.
- **Mongoose**: ODM for MongoDB.
- **Mocha**: Testing framework.
- **Chai**: Assertion library for testing.
- **JSDoc**: For API documentation.

---

## Deployment

The API is live and can be accessed at:

**[https://port-de-plaisance.onrender.com/](https://port-de-plaisance.onrender.com/)**

Accessible Features

The following features can be accessed directly in the production deployment:

    1. Catway Management:
        View available catways.
        List, Add, edit, or delete catways (requires authentication).

    2. Reservation Management:
        View active reservations for specific catways.
        Create a new reservation (requires authentication).
        Delete reservations (requires authentication).

    3. User Authentication:
        Register, edit or delete accounts (requires authentication).
        Log in to access protected endpoints.
        Token-based authentication ensures secure access.

Feel free to explore these features by interacting with the live API.

---

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or remote)
- Git

### Installation Steps
1. Clone the repository:
  ```
  git clone https://github.com/masterxamss/port-de-plaisance.git
  cd port-de-plaisance
  ```

2. Install dependencies:
   **npm install**

3. Create a folder `env` in the root directory and inside the file `.env.development`, configure the following variables:
  ```
   NODE_ENV=development
   APP_NAME=port-de-plaisance
   API_URL=127.0.0.1  
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.tefdl.mongodb.net/<dbName>_dev?retryWrites=true&w=majority&appName=<appName>
   JWT_SECRET=your_secret_key
   PORT=3000

   Ensure you use a separate database (e.g., <dbName>_dev) to avoid interfering with production data. 
  ```

4. In the same folder `env` in the root directory and inside the file `.env.production`, configure the following variables:
  ```
   NODE_ENV=production
   APP_NAME=port-de-plaisance
   API_URL=127.0.0.1  
   MONGO_URI=your_production_database_connection_string
   JWT_SECRET=your_secret_key
   PORT=3000 
  ```

5. Create a file named `.env.test.local` in the `env` folder and configure the following variables:
  ```
   NODE_ENV=test
   APP_NAME=port-de-plaisance
   API_URL=127.0.0.1 
   MONGO_URI=your_production_database_connection_string

   Ensure you use a separate database (e.g., <dbName>_tests) to avoid interfering with production data.
  ```

6. Start the development server:
   **npm run dev**
  ```
   Note: When running the development server with this script, test data is automatically seeded into the database, including a default user with the following credentials:

    Email: john.doe@mail.com
    Password: Admin
  ``` 

7. Access the application locally at http://localhost:3000.


## Usage

### Available Scripts

Start server:
```
  npm start
```

Development mode: Runs the application using nodemon for automatic restarts during development and show result tests in the console.
```
  npm run dev
```

Production mode: Runs the application using nodemon for automatic restarts.
```
  npm run prod
```

Run tests
```
  npm test  
```

Generate documentation
```
  npm run doc 
```

## API Documentation

### The API documentation is generated using JSDoc and can be found in the docs folder.

### To regenerate the documentation:
```
  npm run doc 
```

## Testing

### This project includes unit tests written with Mocha and Chai.

### To run the tests:
```
  npm test 
```

## Contributing

### We welcome contributions! Follow these steps:

1. Fork the repository.
2. Create a new branch:
```
  git checkout -b feature/your-feature-name
```

3. Commit your changes:
```
  git commit -m "Add your message here"
```

4. Push the branch:
```
  git push origin feature/your-feature-name
```
5. Submit a pull request.



