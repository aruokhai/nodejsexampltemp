const http = require("http");

const port = process.env.ENCLAVE_APP_PORT || "7074";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from the enclave!\n");
});

server.listen(port, () => {
  console.log(`listening on :${port}`);
});
