# Flashcards API

A REST API for managing study flashcards with a score-based review system.
Built with Node.js, Express, and SQLite.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

## Setup & Run

1. Clone the repository

   git clone 
   cd flashcards-api

2. Install dependencies

   npm install

3. Start the server

   npm start

The API will be running at http://localhost:3000

For development with auto-restart:

   npm run dev

> The SQLite database file is created automatically at `data/flashcards.db` on first run.
> No database setup or configuration required.

## API Endpoints

### Cards

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /cards | Create a new flashcard |
| GET | /cards | Get all cards (optional: ?tag=) |
| GET | /cards/:id | Get a single card by ID |
| PUT | /cards/:id | Update a card |
| DELETE | /cards/:id | Delete a card |

### Review System

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /cards/:id/review | Mark a card correct or wrong |
| GET | /cards/review | Get cards sorted by score (lowest first) |

## Example Usage

### Create a card

POST /cards
Content-Type: application/json

{
  "front": "What is a closure?",
  "back": "A function that retains access to its outer scope",
  "tag": "javascript"
}

### Mark a card correct

POST /cards/1/review
Content-Type: application/json

{
  "correct": true
}

### Get review queue

GET /cards/review
GET /cards/review?tag=javascript

## Project Structure

flashcards-api/
├── src/
│   ├── db/
│   │   ├── database.js       # SQLite connection
│   │   └── schema.js         # Table creation
│   ├── routes/
│   │   └── cards.js          # All /cards route handlers
│   ├── middleware/
│   │   └── validateCard.js   # Input validation middleware
│   └── app.js                # Express app setup
├── data/                     # SQLite database file (auto-generated)
├── server.js                 # Entry point
└── package.json