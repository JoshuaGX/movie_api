const http = require('http'),
url = require('url'),
fs = require('fs');


http.createServer((request, response) => {
  const addr = request.url;
  const q = url.parse(addr, true);
  let filePath = '';

  if (q.pathname.includes('documentation')) {
    filePath = (`${__dirname}/documentation.html`);
  } else {
    filePath = 'index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Typew': 'text/plain' });
    response.write(data);
    response.end();
  });

  fs.appendFile('log.txt', `URL: ${addr}\nTimestamp: ${Date()}\n\n`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });
}).listen(8080);
