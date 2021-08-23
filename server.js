'use strict';
const http = require('http');

const fs = require('fs');
console.log('This is after the read call');
// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => {
    if (req.url == '/songs') { //check the URL of the current request
        var songs = fs.readFileSync('./test.json', 'utf8')
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(songs);  
        res.end();  
}
});

// Start the server on port 3000
app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');