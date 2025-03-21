export function SOCKET(
    client: import('ws').WebSocket,
    _request: import('http').IncomingMessage,
    _server: import('ws').WebSocketServer
) {
  console.log('A client connected');

  client.on('message', async (message: any) => {
    const msg = message.toString();
    if (msg === 'ping') {
      client.send('pong')
    }
  })
    
  client.on('close', () => {
      console.log('A client disconnected');
    });
}
  