const http = require('http');
const port = process.env.PORT || 3031;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const msg = 'How are YOu?!\n'
  res.end(msg);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
