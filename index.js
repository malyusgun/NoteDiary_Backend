import 'dotenv/config';
import { WebSocketServer } from 'ws';
import HomeController from './controllers/homeController.js';
import path from 'node:path';
import fs from 'node:fs';

const PORT = process.env.PORT || 5000;
const FILES_PORT = process.env.FILES_PORT || 5001;

const users = new Set();

const wss = new WebSocketServer(
  {
    port: PORT
  },
  () => console.log(`Started listen on port ${PORT}`)
);

const filesWss = new WebSocketServer(
  {
    port: FILES_PORT
  },
  () => console.log(`Started listen on port ${FILES_PORT}`)
);

wss.on('connection', (ws) => {
  users.add(ws);
  ws.id = Date.now();
  ws.on('message', async (req) => {
    req = JSON.parse(req);
    // console.log('req: ', req);
    switch (req.event) {
      case 'getHomeBackground':
        const homeBackground = await HomeController.getHomeBackground();
        submitFilesToUsers(homeBackground);
        break;
      case 'changeHomeBackground':
        await HomeController.changeHomeBackground(req);
        submitToUsers('changeHomeBackground', { ...req.body });
        break;
      case 'removeHomeBackground':
        await HomeController.removeHomeBackground();
        break;
      case 'getHomeEntities':
        const getHomeEntitiesData = await HomeController.getEntities();
        getHomeEntitiesData.entitiesImages.forEach((entityBuffer) => {
          submitFilesToUsers(entityBuffer);
        });
        submitToUsers('getHomeEntities', getHomeEntitiesData.entities);
        break;
      case 'createHomeEntity':
        const createdHomeEntity = await HomeController.createEntity(req);
        submitToUsers('createHomeEntity', createdHomeEntity);
        break;
      case 'editHomeEntity': {
        const editedHomeEntity = await HomeController.editEntity(req);
        submitToUsers('editHomeEntity', editedHomeEntity);
        break;
      }
      case 'cropImage': {
        const editedHomeEntity = await HomeController.cropImage(req);
        submitToUsers('editHomeEntity', editedHomeEntity);
        break;
      }
      case 'deleteHomeEntity':
        const deletedHomeEntity = await HomeController.deleteEntity(req);
        submitToUsers('deleteHomeEntity', deletedHomeEntity);
        break;
      case 'changeOrderHomeEntity':
        await HomeController.changeOrderEntity(req);
        submitToUsers('changeOrderHomeEntity', { ...req.body });
        break;
    }
  });
});

filesWss.on('connection', (ws) => {
  users.add(ws);
  console.log('users: ', users.size);
  ws.on('message', async (req) => {
    console.log('req: ', req);
    await HomeController.createImage(req);
    submitToUsers('createImageHomeEntity', '');
  });
});

function submitToUsers(event, data) {
  // console.log('data in submitToUsers:', data);
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        event: event,
        data: data
      })
    );
  });
}

function submitFilesToUsers(data) {
  filesWss.clients.forEach((client) => {
    client.send(data);
  });
}
