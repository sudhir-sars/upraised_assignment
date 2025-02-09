// src/app.ts
import express from 'express';
import cors from 'cors';
import gadgetRoutes from './routes/gadgetRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/gadgets', gadgetRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
