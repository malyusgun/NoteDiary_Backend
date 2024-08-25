import 'dotenv/config';
import { WebSocketServer } from 'ws';
import HomeController from './controllers/homeController.js';

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
    console.log('req: ', req);
    switch (req.event) {
      case 'getHomeEntities':
        const getHomeEntitiesData = await HomeController.getEntities();
        getHomeEntitiesData.entitiesImages.forEach((entityBlob) => {
          submitFilesToUsers(entityBlob);
        });
        submitToUsers('getHomeEntities', getHomeEntitiesData.entities);
        break;
      case 'getHomeBackgroundUrl':
        const homeBackgroundUrl = await HomeController.getHomeBackgroundUrl();
        submitToUsers('getHomeBackgroundUrl', homeBackgroundUrl);
        break;
      case 'createHomeEntity':
        const createdHomeEntity = await HomeController.createEntity(req);
        submitToUsers('createHomeEntity', createdHomeEntity);
        break;
      case 'editHomeEntity':
        const editedHomeEntity = await HomeController.editEntity(req);
        submitToUsers('editHomeEntity', editedHomeEntity);
        break;
      case 'deleteHomeEntity':
        const deletedHomeEntity = await HomeController.deleteEntity(req);
        submitToUsers('deleteHomeEntity', deletedHomeEntity);
        break;
      case 'changeOrderHomeEntity':
        await HomeController.changeOrderEntity(req);
        submitToUsers('changeOrderHomeEntity', { ...req.body });
        break;
      case 'changeHomeBackgroundUrl':
        await HomeController.changeHomeBackgroundUrl(req);
        submitToUsers('changeHomeBackgroundUrl', { ...req.body });
        break;
    }
  });
});

filesWss.on('connection', (ws) => {
  users.add(ws);
  console.log('users: ', users.size);
  ws.on('message', async (req) => {
    console.log('req', req);
    await HomeController.createImageEntity(req);
    submitToUsers('createImageHomeEntity', 'Post data of image, please');
  });
});

function submitToUsers(event, data) {
  console.log('data in submitToUsers:', data);
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
  console.log('submitFilesToUsers', data);
  filesWss.clients.forEach((client) => {
    client.send(data);
  });
}
