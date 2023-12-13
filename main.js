const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");

const http = require('node:http');
const url = require('node:url');

const hostname = '127.0.0.1';
const port = 3030;

function wrap(resp, originalUrl) {
    return `
        <html>
        <head>
        <title>
            ${resp.title}
        </title>
        <style type="text/css">
        body {
            margin: 5em auto;
            max-width: 40em;
            line-height: 1.6;
            font-size: 1.2em;
            font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
            color: #444;
            background-color: linen;
            padding: 0 1em;
        }
        pre {
            overflow-x: scroll;
        }
        a {
            color: #339;
        }
        img {
            max-width: 40em;
        }
        h1, h2, h3 {
            line-height: 1.2;
        }
        .original-url {
            font-size: 0.8em;
            font-style: italic;
        }
        </style>
        </head>
        <body>
        <div class="original-url">
            Orignally from <a href=${originalUrl}>${originalUrl}</a>
        </div>
        ${resp.content}
        </body>
        </html>
    `;
}

async function getReaderSiteContent(url) {
    const response = await fetch(url);
    const text = await response.text();

    const doc = new JSDOM(text);
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    return article;
}

const server = http.createServer((req, res) => {
    const url_parts = url.parse(req.url, true);
    const { query } = url_parts;

    if (!!query) {
        console.log(query);
        getReaderSiteContent(query.site)
            .then((r) => {
                console.log("success");
                res.setHeader('content-type', 'text/html; charset=utf-8');
                res.statusCode = 200;
                const body = wrap(r, query.site);
                res.end(`${body}\n`);
            })
            .catch((_) => {
                console.log("failure");
                res.statusCode = 404;
            })
    } else {
        console.log(query);
        res.statusCode = 400;
        res.setHeader('Content-type', 'text/html');
        res.end(`<html><body><strong>400 - Bad Request</strong></body></html>\n`);
        console.log("sent");
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
