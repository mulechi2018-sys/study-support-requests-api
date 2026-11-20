# Study Support Requests API

## 1. Project Description

The Study Support Requests API is a backend application developed using Node.js, Express.js, and PostgreSQL.

It allows users to create, view, update, and delete study support requests.

## 2. Technologies Used

- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL client)
- CORS
- dotenv
- Postman

## 3. Project Features

- Create a new study support request.
- View all study support requests.
- View one request using its ID.
- Update an existing request.
- Delete a request.
- Validate user input.
- Check API and database health.

## 4. Installation

First, install the project dependencies:

```bash
npm install
```

## 5. Environment Configuration

Create a `.env` file in the project root and configure:

```env
DATABASE_URL=your_postgresql_connection_string
DATABASE_SSL=false
CLIENT_ORIGINS=http://localhost:5500
PORT=3000
```

Do not share or upload your actual database password or `.env` file.

## 6. Running the API

Start the server using:

```bash
npm start
```

The API will run at:

http://localhost:3000

## 7. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | API guide |
| GET | /health | Check API and database |
| GET | /api/records | Get all records |
| GET | /api/records/:id | Get one record |
| POST | /api/records | Create a record |
| PUT | /api/records/:id | Update a record |
| DELETE | /api/records/:id | Delete a record |

## 8. Record Fields

Each study support request contains:

- id
- title
- category
- description
- status

Allowed statuses:

- Pending
- In progress
- Completed

## 9. Validation Rules

- Title must contain 3–80 characters.
- Category must contain 2–40 characters.
- Description must contain 5–300 characters.
- Status must be Pending, In progress, or Completed.
- Invalid record IDs are rejected.
- Requests for records that do not exist return a 404 error.

## 10. Testing

The API endpoints were tested using Postman.

Tests included:

- GET all records.
- GET one record.
- POST a new record.
- PUT an existing record.
- DELETE a record.
- Invalid input validation.
- Non-existent record validation.
- API health check.

## 11. Database

The project uses PostgreSQL to store study support requests in a table named `records`.