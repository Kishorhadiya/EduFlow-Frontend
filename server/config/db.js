const mongoose = require('mongoose');

// Connection cache for serverless environments (Vercel)
// Reuses existing connection across warm function invocations
let cachedConnection = null;

const connectDB = async () => {
    // Return cached connection if already established
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Optimized settings for serverless / Atlas
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        cachedConnection = conn;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Do NOT call process.exit() — it terminates the Vercel serverless function
        // Let the calling code handle the failure gracefully
        throw err;
    }
};

module.exports = connectDB;
