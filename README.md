# Order Processing & Background Job System

A full-stack order processing system built with React, Node.js, Express, MongoDB, Redis and BullMQ.

The application demonstrates asynchronous background job processing where orders are created immediately and processed by a separate worker.

---

## Features

- Create orders
- Automatic total calculation
- Order status lifecycle
- Redis + BullMQ background jobs
- Dedicated worker process
- External API integration
- Automatic retry mechanism
- Failed order retry
- Transaction reference tracking
- Job attempt tracking
- Dashboard statistics
- Order details page
- Processing lifecycle UI
- Automated API tests
- Docker Compose setup
- MongoDB Atlas integration
- Responsive React UI

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Bootstrap
- Custom CSS

### Backend

- Node.js
- Express.js
- Zod
- Mongoose

### Background Processing

- Redis
- BullMQ
- Node.js Worker

### Database

- MongoDB Atlas

### Testing

- Jest
- Supertest

### DevOps

- Docker
- Docker Compose
- Nginx

---

# Architecture

```text
                 Browser
                    |
                    v
             React Frontend
                    |
                    v
             Express Backend
                    |
          +---------+---------+
          |                   |
          v                   v
    MongoDB Atlas          Redis
                              |
                              v
                         BullMQ Worker
                              |
                              v
                          Mock API

                          