const express = require('express');

const app = express();

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Health check route — useful for verifying the server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Flashcards API is running' });
});

// 404 handler — catches any request to a route that doesn't exist
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — catches any error passed via next(err)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

module.exports = app;