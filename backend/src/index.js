import express from 'express';
import authRoutes from './routes/authRoute.js'
import dotenv from "dotenv";
import { connectDB } from './lib/database.js';

dotenv.config()
const app = express();

const PORT = process.env.PORT || 5001

app.use(express.json()); //to extract the json data out of the body

// Connect routes
app.use("/api/auth", authRoutes)


const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();