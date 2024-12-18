import express from 'express';
import next from 'next';
import { parse } from 'url';
import { join } from 'path';
import { createServer } from 'http';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === '/service-worker.js') {
      const filePath = join(__dirname, '.next', pathname);
      app.serveStatic(req, res, filePath);
    } else {
      handle(req, res, parsedUrl);
    }
  });

  createServer(server).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});