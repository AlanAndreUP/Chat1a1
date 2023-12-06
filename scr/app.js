const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {};

wss.on('connection', (ws) => {
    const id = generateUniqueId();
    clients[id] = ws;
    console.log('Nuevo cliente conectado:', id);

    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message);
        for (let clientId in clients) {
            if (clientId !== id) {
                clients[clientId].send(message);
            }
        }
    });

    ws.on('close', () => {
        delete clients[id];
        console.log('Cliente desconectado:', id);
    });
});

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

server.listen(3001, () => {
    console.log('Servidor ejecutándose en http://localhost:3001');
});
