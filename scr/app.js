const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var clients = {};
wss.on('connection', (ws) => {
    var id;

    ws.on('message', (incomingMessage) => {
        console.log('Mensaje recibido:', incomingMessage);

        try {
            const data = JSON.parse(incomingMessage);
          
            if (data.type === 'connection') {
                id = data.clientId;
                clients[id] = ws;
                console.log('Cliente conectado: ', id);
            } else if (data.type === 'message') {
               console.log(data);
                const messageToSend = {
                    type: 'message',
                    text: data.text,
                    senderId: data.clientId
                };
                var IDSend = data.clientId

                // Enviar a otros clientes
                Object.keys(clients).forEach(clientId => {
                    console.log(clientId);
                    console.log(IDSend);
                    if (clientId !== IDSend) {
                        console.log("Enviado")
                        clients[clientId].send(JSON.stringify(messageToSend));
                    }
                });
            }
        } catch (error) {
            console.log('Error al parsear el mensaje:', error);
            // Maneja cualquier error aquí
        }
    });

    ws.on('close', () => {
        delete clients[id];
        console.log('Cliente desconectado:', id);
    });
});

server.listen(3001, () => {
    console.log('Servidor ejecutándose en http://localhost:3001');
});
