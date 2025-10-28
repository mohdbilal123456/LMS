import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDb from './config/db.js';

import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRoute.js';
import courseRouter from './routers/courseRoute.js';
import paymentRouter from './routers/paymentRoute.js';
import reviewRouter from './routers/reviewRoute.js';

dotenv.config();
const app = express();

// 🧩 Config
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧩 Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 🧩 CORS setup — localhost + Render frontend allowed
app.use(
  cors({
    origin: [
      'https://lms-1-vcui.onrender.com', // 👉 replace with your Vercel URL (optional)
    ],
    credentials: true,
  })
);

// 🧩 API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/order', paymentRouter);
app.use('/api/review', reviewRouter);

// 🧩 Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}

// 🧩 Base Route
app.get('/', (req, res) => {
  res.send('Hello Server');
});

// 🧩 Start Server
app.listen(port, async () => {
  await connectDb();
  console.log(`✅ Server started at port ${port}`);
});
