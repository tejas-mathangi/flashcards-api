# ANSWERS.md

## 1. How to Run

Requirements:
- Node.js v18 or higher — https://nodejs.org
- npm (comes with Node.js)

Steps on a fresh machine:

git clone <your-repo-url>
cd flashcards-api
npm install
npm start

The API runs at http://localhost:3000
No database setup needed. The SQLite file is created automatically at data/flashcards.db on first run.
Stop the server, restart it — your data is still there.

---

## 2. Stack Choice

I picked Node.js and Express because I know the ecosystem well enough to write
clean code, not just copy it. That matters for a project like this — I wanted
to be able to explain every line, not just make it work.

For storage I chose SQLite via better-sqlite3. The reason is simple: SQLite is
file-based. There is no database server to install, no credentials to configure,
no connection strings to set up. On a fresh machine, npm install and npm start
is all anyone needs. The database file gets created automatically. That directly
satisfies the "run on a fresh machine" requirement without any extra steps.

A worse choice would have been PostgreSQL. It's not a bad database — it's
actually more powerful — but it requires a running server, a created database,
environment variables, and setup steps before the app works at all. That's
real overhead for a project at this scale. The added power buys nothing here.

I also chose better-sqlite3 over the more common sqlite3 package specifically
because it's synchronous. That made the route handlers significantly simpler —
no callback chains, no promise wrappers, just direct function calls. For a
local API with no concurrent users, synchronous SQLite is the right tradeoff.

---

## 3. One Real Edge Case

File: src/middleware/validateCard.js
Line: the check `front.trim() === ''`

The full condition is:
if (!front || typeof front !== 'string' || front.trim() === '')

The edge case is a user sending a card where front is a string of only spaces,
like { "front": "   ", "back": "some answer" }.

Without the trim() check, this passes validation. The reason is that a string
of spaces is truthy in JavaScript — !front evaluates to false, so the basic
presence check passes. The card gets stored in the database with a blank front.
No error is thrown. The user has no idea. That card then shows up in the review
queue with an invisible question, which silently breaks the review flow.

The trim() check catches this. "   ".trim() === '' evaluates to true, so the
request is rejected with a 400 before it touches the database.

The middleware also sanitizes valid input — req.body.front = front.trim() —
so even legitimate values with accidental leading or trailing spaces are cleaned
before storage. Validate and sanitize in the same place, one job done properly.

---

## 4. AI Usage

I used Claude (claude.ai) throughout this project as a development guide.

Specifically:
- Asked it to help plan the project structure and route design before writing code
- Used it to review each file as I wrote it and suggest improvements
- Asked it to explain why better-sqlite3 was preferable to sqlite3 for this use case
- Asked it to help me understand the WAL mode pragma and whether I needed it

One thing I changed: Claude's initial .gitignore only included data/*.db.
When I ran git status after enabling WAL mode, two extra files appeared —
flashcards.db-shm and flashcards.db-wal. Claude hadn't accounted for those.
I flagged it, understood why WAL mode generates those files, and updated
.gitignore to exclude all three patterns. The fix was mine once I understood
the problem.

---

## 5. Honest Gap

The score system is too simple. Right now it's linear — correct adds 1, wrong
subtracts 1. That means a card you've answered correctly 10 times and then
miss once has a score of 9, and a card you've never seen has a score of 0.
The never-seen card surfaces first in the review queue, which is actually
correct — but there's no way to distinguish "hard card I keep getting wrong"
from "new card I haven't tried yet." The score alone doesn't capture that.

With another day I'd implement a basic version of the SM-2 spaced repetition
algorithm. It factors in how many times you've seen a card and how recently,
not just a raw score. It's the algorithm behind Anki, which is the standard
for flashcard apps for a reason. The database schema already has last_reviewed
which was added with exactly this in mind — the groundwork is there.