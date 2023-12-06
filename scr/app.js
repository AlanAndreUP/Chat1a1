const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {};

wss.on('connection', (ws) => {
    let id;

    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message);
        const data = JSON.parse(message);
        if(data.type === 'connection') {
            id = data.id;
            clients[id] = ws;
            console.log('Cliente conectado: ', id);
        }
        if(data.type === 'message') {
            const message = {
                type: 'message',
                text: data.text,
                senderId: id
            };   
        }
        Object.keys(clients).forEach(clientId => {
            if (clientId !== id) {
                clients[clientId].send(JSON.stringify(message));
            }
        });

    });

    ws.on('close', () => {
        delete clients[id];
        console.log('Cliente desconectado:', id);
    });
});

server.listen(3001, () => {
    console.log('Servidor ejecutándose en http://localhost:3001');
});
