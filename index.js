require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const sapiRoutes = require('./routes/sapi');


const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS — izinkan semua origin ─────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(express.json());

// ─── Endpoint /health ────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'success',
      message: 'Backend is running',
      database: 'connected',
      student: {
        name: 'Daffarael Anaqi Ali',
        nim: '2411523015',
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Backend is running, but database is not connected',
      database: 'disconnected',
      student: {
        name: 'Daffarael Anaqi Ali',
        nim: '2411523015',
      },
    });
  }
});

// ─── Endpoint /schema ────────────────────────────────────────────
app.get('/schema', (req, res) => {
  res.json({
    student: {
      name: 'Daffarael Anaqi Ali',
      nim: '2411523015',
    },
    resource: {
      name: 'sapi',
      label: 'Data Sapi',
      description: 'Aplikasi manajemen data peternakan sapi',
    },
    fields: [
      { name: 'nama',          label: 'Nama Sapi',      type: 'text',   required: true,  showInTable: true  },
      { name: 'ras',           label: 'Ras',            type: 'text',   required: false, showInTable: true  },
      { name: 'jenis_kelamin', label: 'Jenis Kelamin',  type: 'text',   required: true,  showInTable: true  },
      { name: 'berat_badan',   label: 'Berat Badan (kg)',type: 'number', required: false, showInTable: true  },
      { name: 'status',        label: 'Status',         type: 'text',   required: false, showInTable: true  },
      { name: 'keterangan',    label: 'Keterangan',     type: 'text',   required: false, showInTable: true  },
    ],
    endpoints: {
      list:   '/sapi',
      detail: '/sapi/{id}',
      create: '/sapi',
      update: '/sapi/{id}',
      delete: '/sapi/{id}',
    },
  });
});

// ─── Root route (untuk test koneksi frontend) ────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Peternakan Sapi API is running' });
});

// ─── Routes ──────────────────────────────────────────────────────
app.use('/sapi', sapiRoutes);


// ─── Start Server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
