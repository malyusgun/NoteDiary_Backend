import 'dotenv/config';
import { WebSocketServer } from 'ws';
import EntitiesController from './controllers/entitiesController';
import { websocketRoute } from './routes/websocket';
import { connectBot } from './telegramBot';

await connectBot();

const users = new Set();

const PORT = Number(process.env.PORT) || 5000;
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
  console.log('users wss: ', users.size);
  ws.on('message', async (req: Buffer) => {
    await EntitiesController.createImage(req);
    submitToUsers('createImageEntity', '');
  });
});

export function submitToUsers(event: string, data: any) {
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        event: event,
        data: data
      })
    );
  });
}
export function submitFilesToUsers(data: any) {
  filesWss.clients.forEach((client) => {
    client.send(data);
  });
}
