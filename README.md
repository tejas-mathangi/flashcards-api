# Flashcards API

A REST API for managing study flashcards with a score-based review system.
Built with Node.js, Express, and SQLite.

## How to Run (Fresh Machine)

You need Node.js v18 or higher installed. Download it from https://nodejs.org if you don't have it.

1. Clone the repository

   git clone <your-repo-url>
   cd flashcards-api

2. Install dependencies

   npm install

3. Start the server

   npm start

The API will be running at http://localhost:3000

That's it. No database setup, no configuration, no environment variables needed.
The SQLite database file is created automatically at data/flashcards.db on first run.
Restart the server and your data is still there.

## The Meaningful Feature — Score-Based Review Queue

Beyond basic CRUD, the API includes a review system.

Every card has a score (starts at 0).
- POST /cards/:id/review with { "correct": true } increments the score
- POST /cards/:id/review with { "correct": false } decrements the score

GET /cards/review returns all cards sorted by score ascending — lowest score first.
This means cards you keep getting wrong surface at the top of your queue automatically.
You can also filter by tag: GET /cards/review?tag=javascript

This is a feature I'd actually want. A plain CRUD flashcard app makes you decide
what to study next. This one tells you.

## API Endpoints

### Cards

| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| POST   | /cards            | Create a new flashcard             |
| GET    | /cards            | Get all cards (optional: ?tag=)    |
| GET    | /cards/:id        | Get a single card by ID            |
| PUT    | /cards/:id        | Update a card                      |
| DELETE | /cards/:id        | Delete a card                      |

### Review System

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| POST   | /cards/:id/review     | Mark a card correct or wrong             |
| GET    | /cards/review         | Get cards sorted by score (lowest first) |

## Example Requests

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