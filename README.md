# Lith&Talk – Full Stack Application

Lith&Talk is a full-stack web application designed to help users learn Lithuanian through structured vocabulary, categories, and interactive learning features.

The system consists of a React frontend and a Spring Boot backend, working together to provide a secure and user-friendly language learning experience.

---

## Architecture Overview

Frontend (React) ⇄ Backend (Spring Boot API) ⇄ MySQL Database

- Frontend handles UI/UX and user interaction  
- Backend manages business logic, authentication, and data processing  
- Database stores users, words, categories, and reviews  

---

## Tech Stack

### Frontend
- React  
- JavaScript (ES6+)  
- CSS / Tailwind  
- Axios (API requests)  

### Backend
- Java 17  
- Spring Boot  
- Spring Security  
- JWT Authentication  
- Hibernate / JPA  
- MySQL  
- Maven  

---

## Features

### User Features
- User registration and login  
- Secure authentication (JWT with HttpOnly cookies)  
- Browse Lithuanian vocabulary  
- Filter words by categories  
- Submit reviews and feedback  

### Security
- Password hashing (Argon2)  
- JWT-based authentication  
- Protected API endpoints  

### Learning System
- Words with translations  
- Category-based grouping  
- Expandable for quizzes and gamification  

---

## Setup Instructions

### 1. Clone Repository

bash
git clone https://github.com/kateryna051/diploma.git

## Run Backend
- Configure Database

# Edit:

- backend/src/main/resources/application.properties

# Add:

- pring.datasource.url=jdbc:mysql://localhost:3306/lithtalk
- spring.datasource.username=root
- spring.datasource.password=yourpassword

- spring.jpa.hibernate.ddl-auto=update
- Start Backend
- cd backend/project-backend
- mvn spring-boot:run

# Backend runs on:
http://localhost:8080

Run Frontend
cd frontend
npm install
npm start

Frontend runs on:
http://localhost:3000

Authentication Flow
User registers or logs in
Backend validates credentials
JWT token is generated
Token is stored in HttpOnly cookies
Frontend sends authenticated requests
API Overview
Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
Words
GET /api/words
GET /api/words/{id}
POST /api/words
Categories
GET /api/categories
POST /api/categories
Reviews
GET /api/reviews
POST /api/reviews
Database Entities
User
Word
Category
Review
Relationships
Category → multiple words
User → multiple reviews
Architecture Pattern
Backend

Controller → Service → Repository → Database

Frontend

Components → Pages → API Services

Future Improvements
Gamification (XP, levels, streaks)
User progress tracking
Swagger API documentation
About

This project was developed as a Bachelor’s thesis, focusing on building a modern and accessible Lithuanian language learning platform.

Author

Kateryna Patsui
