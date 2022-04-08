const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime");

const { PORT = 8000 } = process.env;
const cars = require('../data/cars.min.json');
const PUBLIC_DIRECTORY = path.join(__dirname, "..", "public");

// function to read html file in the public directory
function getHTML(htmlFileName) {
    const htmlFilePath = path.join(PUBLIC_DIRECTORY, htmlFileName); 
    return fs.readFileSync(htmlFilePath, "utf-8");
}

// When client request to http://localhost:8000 the function will be called
function onRequest(req, res) {
    if (req.url === "/") {
        const html = getHTML("index.html"); 
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
    } else if (req.url.match(".css$") || req.url.match(".js$")) {
        const filePath = path.join(__dirname, "..", "public", req.url);
        const fileStream = fs.createReadStream(filePath, "UTF-8");
        const mimeType = mime.getType(filePath);
        res.writeHead(200, { "Content-Type": mimeType });
        fileStream.pipe(res);
    } else if (req.url.match(".jpg$") || req.url.match(".png$")) {
        const filePath = path.join(__dirname, "..", "public", req.url);
        const fileStream = fs.createReadStream(filePath);
        const mimeType = mime.getType(filePath);
        res.writeHead(200, { "Content-Type": mimeType });
        fileStream.pipe(res);
    } else if (req.url === "/cars") {
        const cars = getHTML("cars.html"); 
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(cars);
    } else if (req.url === "/api/cars") {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(cars));
        return
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("No Page Found");
    }
}

// Create server 
const server = http.createServer(onRequest);

// Run the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});
