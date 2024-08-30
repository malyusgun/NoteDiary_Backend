import 'dotenv/config';
import { WebSocketServer } from 'ws';
import HomeController from './controllers/homeController.js';
import { websocketRoute } from './routes/websocket.js';
import { connectBot } from './telegramBot/index.js';

await connectBot();

const users = new Set();

const PORT = process.env.PORT || 5000;
const FILES_PORT = process.env.FILES_PORT || 5001;

const wss = new WebSocketServer(
  {
    port: PORT
  },
  () => console.log(`Started listen on port ${PORT}`)
);
wss.on('connection', (ws) => {
  users.add(ws);
  ws.id = Date.now();
  ws.on('message', async (req) => {
    req = JSON.parse(req);
    await websocketRoute(req);
  });
});

const filesWss = new WebSocketServer(
  {
    port: FILES_PORT
  },
  () => console.log(`Started listen on port ${FILES_PORT}`)
);
filesWss.on('connection', (ws) => {
  users.add(ws);
  console.log('users: ', users.size);
  ws.on('message', async (req) => {
    await HomeController.createImage(req);
    submitToUsers('createImageHomeEntity', '');
  });
});

export function submitToUsers(event, data) {
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        event: event,
        data: data
      })
    );
  });
}
export function submitFilesToUsers(data) {
  filesWss.clients.forEach((client) => {
    client.send(data);
  });
}
