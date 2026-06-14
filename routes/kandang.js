const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET semua kandang
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kandang');
    res.json({ status: 'success', message: 'Data retrieved successfully', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET kandang by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kandang WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ status: 'error', message: 'Kandang tidak ditemukan' });
    res.json({ status: 'success', message: 'Data retrieved successfully', data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST tambah kandang
router.post('/', async (req, res) => {
  const { nama_kandang, kapasitas, lokasi } = req.body;
  if (!nama_kandang || !kapasitas) {
    return res.status(400).json({ status: 'error', message: 'nama_kandang dan kapasitas wajib diisi' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO kandang (nama_kandang, kapasitas, lokasi) VALUES (?, ?, ?)',
      [nama_kandang, kapasitas, lokasi]
    );
    const [rows] = await pool.query('SELECT * FROM kandang WHERE id = ?', [result.insertId]);
    res.status(201).json({ status: 'success', message: 'Data created successfully', data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT update kandang
router.put('/:id', async (req, res) => {
  const { nama_kandang, kapasitas, lokasi } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE kandang SET nama_kandang=?, kapasitas=?, lokasi=? WHERE id=?',
      [nama_kandang, kapasitas, lokasi, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Kandang tidak ditemukan' });
    const [rows] = await pool.query('SELECT * FROM kandang WHERE id = ?', [req.params.id]);
    res.json({ status: 'success', message: 'Data updated successfully', data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE kandang
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM kandang WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Kandang tidak ditemukan' });
    res.json({ status: 'success', message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
