const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
// Get all todos (optionally filter by trashed, date)
app.get('/api/todos', async (req, res) => {
  try {
    const { trashed, date } = req.query;
    let query = 'SELECT * FROM todos';
    let params = [];
    let where = [];
    if (trashed !== undefined) {
      where.push('trashed = $' + (params.length + 1));
      params.push(trashed === 'true');
    }
    if (date) {
      where.push('due_date::date = $' + (params.length + 1));
      params.push(date);
    }
    if (where.length) query += ' WHERE ' + where.join(' AND ');
    query += ' ORDER BY due_date ASC, id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

// Create todo (with title, due_date, reminder)
app.post('/api/todos', async (req, res) => {
  try {
    const { title, due_date, reminder } = req.body;
    const result = await pool.query(
      'INSERT INTO todos (title, due_date, reminder) VALUES ($1, $2, $3) RETURNING *',
      [title, due_date, reminder]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

// Update todo (title, completed, due_date, reminder)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, due_date, reminder } = req.body;
    const result = await pool.query(
      'UPDATE todos SET title = $1, completed = $2, due_date = $3, reminder = $4 WHERE id = $5 RETURNING *',
      [title, completed, due_date, reminder, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

// Soft delete (move to trash)
app.patch('/api/todos/:id/trash', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE todos SET trashed = TRUE WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

// Restore from trash
app.patch('/api/todos/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE todos SET trashed = FALSE WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

// Permanently delete
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
