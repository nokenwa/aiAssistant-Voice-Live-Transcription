const { Server } = require("node:http");
const { parse } = require("node:url");
const next = require("next");
const { setHttpServer, setWebSocketServer } = require("next-ws/server");
const { WebSocketServer } = require("ws");

const httpServer = new Server();
setHttpServer(httpServer);
const webSocketServer = new WebSocketServer({ noServer: true });
setWebSocketServer(webSocketServer);

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port, customServer: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  httpServer
    .on("request", async (req:Request, res:Response) => {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    })
    .listen(port, () => {
      console.log(` ▲ Ready on http://${hostname}:${port}`);
    });

  webSocketServer.on("listening", () => {
    console.log(` ▲ Ready on wss://${hostname}:${port}`);
  });

  webSocketServer.on("error", () => {
    console.log(` Error`);
  });
});

export {}