const { createServer } = require('https');
const { parse } = require('url');
const { readFileSync } = require('fs');
const next = require('next');

const port = 3000;
const dev = false
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: readFileSync('./certificates/newKey.pvk'),
    cert: readFileSync('./certificates/newCer.cer')
};

app.prepare()
    .then(() => {
        createServer(httpsOptions, (req, res) => {
            const parsedUrl = parse(req.url, true);
            handle(req, res, parsedUrl);
        }).listen(port, err => {
            if (err) throw err;
            console.log(`> ` + process.env.NODE_ENV + ` Ready on https://localhost:${port}`);
        })
    });