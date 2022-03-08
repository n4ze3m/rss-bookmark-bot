import http from "http"
// this will create a server that will listen on port 5000
http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Alive\n")
}).listen(5000)