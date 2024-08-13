import 'dotenv/config';
import {WebSocketServer} from "ws";
import HomeController from "./controllers/homeController.js";
import {sequelize} from "./db.js";
import { Home_entity, User } from "./models/index.js";

const PORT = process.env.PORT || 5000;

const users = new Set();

const wss = new WebSocketServer({
    port: PORT
}, () => console.log(`Started listen on port ${PORT}`))

wss.on('connection', (ws) => {
    users.add(ws);
    ws.id = Date.now();
    ws.on('message', async (req) => {
        req = JSON.parse(req);
        switch (req.event) {
            case 'getHomeEntities':
                const getHomeEntitiesData = await HomeController.getEntities();
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify({event: 'getHomeEntities', data: getHomeEntitiesData}))
                });
                break;
            case 'createHomeEntity':
                const createdHomeEntity = await HomeController.createEntity(req);
                    wss.clients.forEach((client) => {
                    client.send(JSON.stringify({
                        event: 'createHomeEntity',
                        data: createdHomeEntity
                    }));
                });
                break;
            case 'editHomeEntity':
                const editedHomeEntity = await HomeController.editEntity(req);
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify({
                        event: 'editHomeEntity',
                        data: editedHomeEntity
                    }));
                });
                break;
            case 'deleteHomeEntity':
                const deletedHomeEntity = await HomeController.deleteEntity(req);
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify({
                        event: 'deleteHomeEntity',
                        data: deletedHomeEntity
                    }));
                });
                break;
            case 'changeOrderHomeEntity':
                await HomeController.changeOrderEntity(req);
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify({
                        event: 'changeOrderHomeEntity',
                        data: {...req.body}
                    }));
                });
                break;
        }
    })
})

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        console.log(error)
    }
}

await start();