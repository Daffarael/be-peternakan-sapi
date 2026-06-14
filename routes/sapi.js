const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET semua sapi
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, k.nama_kandang 
      FROM sapi s 
      LEFT JOIN kandang k ON s.id_kandang = k.id
    `);
    res.json({ status: 'success', message: 'Data retrieved successfully', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET sapi by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, k.nama_kandang 
      FROM sapi s 
      LEFT JOIN kandang k ON s.id_kandang = k.id
      WHERE s.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ status: 'error', message: 'Sapi tidak ditemukan' });
    res.json({ status: 'success', message: 'Data retrieved successfully', data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST tambah sapi
router.post('/', async (req, res) => {
  const { nama, ras, jenis_kelamin, berat_badan, status, id_kandang, keterangan } = req.body;
  if (!nama || !jenis_kelamin) {
    return res.status(400).json({ status: 'error', message: 'nama dan jenis_kelamin wajib diisi' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO sapi (nama, ras, jenis_kelamin, berat_badan, status, id_kandang, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nama, ras, jenis_kelamin, berat_badan, status || 'Sehat', id_kandang, keterangan]
    );
    const [rows] = await pool.query('SELECT * FROM sapi WHERE id = ?', [result.insertId]);
    res.status(201).json({ status: 'success', message: 'Data created successfully', data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT update sapi
router.put('/:id', async (req, res) => {
  const { nama, ras, jenis_kelamin, berat_badan, status, id_kandang, keterangan } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE sapi SET nama=?, ras=?, jenis_kelamin=?, berat_badan=?, status=?, id_kandang=?, keterangan=? WHERE id=?',
      [nama, ras, jenis_kelamin, berat_badan, status, id_kandang, keterangan, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Sapi tidak ditemukan' });
    const [rows] = await pool.query('SELECT * FROM sapi WHERE id = ?', [req.params.id]);
    res.json({ status: 'success', message: 'Data updated successfully', data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE sapi
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM sapi WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Sapi tidak ditemukan' });
    res.json({ status: 'success', message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
