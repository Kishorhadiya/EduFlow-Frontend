const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// ── CORS Configuration ────────────────────────────────────────────────────────
// Reads allowed origins from env var for flexibility across environments.
// In development: defaults to localhost.
// In production: set ALLOWED_ORIGIN in Vercel env vars to your frontend URL.
const allowedOrigins = process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, server-to-server, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // In development, allow all origins for easier testing
        if (process.env.NODE_ENV !== 'production') return callback(null, true);
        callback(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'EduFlow API is running...', status: 'ok' });
});

// 404 handler — for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// Express 5 automatically forwards async errors here.
// Returns JSON errors instead of HTML, preventing frontend parsing failures.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.message);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// ── Server Start (local dev only) ─────────────────────────────────────────────
// Vercel handles the HTTP server — we only listen locally.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    // Connect to DB then start server
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error('Failed to connect to DB, server not started:', err.message);
        });
} else {
    // In production (Vercel), connect DB on first invocation
    // The connectDB function caches the connection for reuse
    connectDB().catch(err => console.error('Initial DB connection failed:', err.message));
}

module.exports = app;
