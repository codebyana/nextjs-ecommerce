const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Disable worker process spawning to comply with cPanel nproc limits
process.env.NEXT_PRIVATE_WORKERS = '0';
process.env.UV_THREADPOOL_SIZE = '2';

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Create HTTP server synchronously so LiteSpeed/Passenger binds to it immediately
const server = createServer((req, res) => {
  try {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  } catch (err) {
    console.error('Error handling request:', req.url, err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.prepare().then(() => {
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port ${port}`);
  });
}).catch((err) => {
  console.error('App prepare error:', err);
  process.exit(1);
});
