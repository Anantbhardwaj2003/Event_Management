# Event Management System

## Overview
This project is an Event Management System that allows users to create, manage, and join events. It includes both a backend and a frontend, built with modern web technologies.

## Features
- User Authentication (Register, Login, Logout)
- Create, Update, Delete Events
- Join and Leave Events
- Real-time updates with Socket.IO
- Image upload with Cloudinary
- Protected routes for authenticated users

## Technologies Used
### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Cloudinary for image storage
- Socket.IO for real-time updates

### Frontend
- React
- React Router
- Tailwind CSS
- Framer Motion for animations
- Socket.IO Client

## Installation

### Prerequisites
- Node.js
- MongoDB

### Backend Setup
1. Navigate to the backend directory:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file in the backend directory and add the following:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    PORT=5000
    ```
4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the frontend development server:
    ```sh
    npm run dev
    ```

## Usage
1. Register a new user or login with an existing account.
2. Create a new event by filling in the event details.
3. View all events on the dashboard.
4. Join or leave events.
5. View event details and see real-time updates.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License.

## Contact
For any questions or inquiries, please contact the project maintainer at [contact.chiranjit.ml@gmail.com].
