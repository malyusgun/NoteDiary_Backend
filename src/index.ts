import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes/main';
import routerBuffer from './routes/buffers';
import cookieParser from 'cookie-parser';
import { connectBot } from './telegramBot';

await connectBot();

const app = express();
const appBuffer = express();

const PORT = Number(process.env.PORT) || 5000;
const BUFFER_PORT = process.env.BUFFER_PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL
  })
);
app.use('/api/v1', router);

// порт для отправки буффера на сервер
appBuffer.use(express.raw({ type: 'image/jpeg', limit: '100mb' }));
appBuffer.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL
  })
);
appBuffer.use('/api/v1', routerBuffer);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
appBuffer.listen(BUFFER_PORT, () => console.log(`Listening buffers on ${BUFFER_PORT}`));
