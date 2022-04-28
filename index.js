const http = require('http');
const port = process.env.PORT || 3058;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const msg = 'how are \n'
  res.end(msg);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
