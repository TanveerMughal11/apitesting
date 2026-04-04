const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BY ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const existing = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
      [title, description || '', status || 'pending', id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// image upload
const upload = require('../upload');
const supabase = require('../supabaseClient');

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = `task-${Date.now()}`;

    const { data, error } = await supabase.storage
      .from('task-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data: publicUrl } = supabase.storage
      .from('task-images')
      .getPublicUrl(fileName);

    res.json({
      message: 'Uploaded',
      url: publicUrl.publicUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not Found' });
    }

    res.json({ message: 'Task deleted Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST add task
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title, description || '', status || 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;