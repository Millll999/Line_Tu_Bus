import express from 'express';
import { configureLineBot } from './linebot.js';

const app = express();
const PORT = 4000;

configureLineBot(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});