const app = require('./src/app');
const { createTables } = require('./src/db/schema');

const PORT = process.env.PORT || 3000;

createTables();

app.listen(PORT, () => {
  console.log(`Flashcards API running on http://localhost:${PORT}`);
});