const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /cards — create a new flashcard
router.post('/', (req, res) => {
  const { front, back, tag } = req.body;

  if (!front || !back) {
    return res.status(400).json({ error: 'front and back are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO cards (front, back, tag)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(front, back, tag || null);

  const newCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json(newCard);
});

// GET /cards — get all cards, with optional ?tag= filter
router.get('/', (req, res) => {
  const { tag } = req.query;

  let stmt;

  if (tag) {
    stmt = db.prepare('SELECT * FROM cards WHERE tag = ? ORDER BY created_at DESC');
    const cards = stmt.all(tag);
    return res.json(cards);
  }

  stmt = db.prepare('SELECT * FROM cards ORDER BY created_at DESC');
  const cards = stmt.all();
  res.json(cards);
});

// GET /cards/:id — get a single card by ID
router.get('/:id', (req, res) => {
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  res.json(card);
});

// PUT /cards/:id — update a card's front, back, or tag
router.put('/:id', (req, res) => {
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  const front = req.body.front ?? card.front;
  const back = req.body.back ?? card.back;
  const tag = req.body.tag ?? card.tag;

  db.prepare(`
    UPDATE cards SET front = ?, back = ?, tag = ? WHERE id = ?
  `).run(front, back, tag, req.params.id);

  const updatedCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
  res.json(updatedCard);
});

// DELETE /cards/:id — delete a card
router.delete('/:id', (req, res) => {
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);

  res.json({ message: 'Card deleted successfully', id: Number(req.params.id) });
});

// POST /cards/:id/review — mark a card correct or wrong
router.post('/:id/review', (req, res) => {
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  const { correct } = req.body;

  if (typeof correct !== 'boolean') {
    return res.status(400).json({ error: '"correct" field is required and must be a boolean' });
  }

  const newScore = correct ? card.score + 1 : card.score - 1;
  const reviewedAt = new Date().toISOString();

  db.prepare(`
    UPDATE cards SET score = ?, last_reviewed = ? WHERE id = ?
  `).run(newScore, reviewedAt, req.params.id);

  const updatedCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
  res.json(updatedCard);
});

module.exports = router;