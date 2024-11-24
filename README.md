# Bicycle Store management

## Overview
This project is an Express application built with TypeScript, MongoDB, and Mongoose to manage a Bicycle Store. The API supports CRUD operations for bicycles and orders with inventory management and revenue calculation.

## Features
- Create, Read, Update, Delete (CRUD) operations for bicycles Product.
- Place orders and manage stock levels automatically.
- Calculate total revenue from all orders using MongoDB aggregation.
- Robust error handling and validation.

## Technologies Used
- Node.js: JavaScript runtime for building scalable applications.
- Express.js: Minimal and flexible Node.js web framework.
- TypeScript: Statically typed superset of JavaScript.
- MongoDB: NoSQL database for flexible and scalable data storage.
- Mongoose: ODM library for MongoDB to enforce schemas and validations.
- dotenv: Manages environment variables securely.
- Nodemon: Automatically restarts the application on code changes (for development).

## Error Handling
- Validation Errors: Ensures all input data meet predefined rules.
- Not Found Errors: Returns a 404 response if a resource doesn't exist.
- Insufficient Stock Errors: Prevents orders if the stock is too low.
