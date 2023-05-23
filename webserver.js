//create web server and listen on port 3000
const http = require('http');
const port = 3000;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    //write a response to the client
    res.end('Hello World\n');
});
server.listen(port, () => {
    //callback triggered when server is successfully listening. Hurray!
    console.log(`Server running at http://localhost:${port}/`);
});
//# sourceMappingURL=webserver.js.map