const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');

const app = express();
app.use(bodyParser.json());

const xmlFile = 'posts.xml';

// Read XML Data
function readXML(callback) {
    fs.readFile(xmlFile, (err, data) => {
        if (err) throw err;
        xml2js.parseString(data, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    });
}

// Write XML Data
function writeXML(data, callback) {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(data);
    fs.writeFile(xmlFile, xml, (err) => {
        if (err) throw err;
        callback();
    });
}

// API Endpoints
app.get('/posts', (req, res) => {
    readXML((data) => res.json(data));
});

app.post('/posts', (req, res) => {
    const newPost = req.body;
    readXML((data) => {
        data.posts.post.push(newPost);
        writeXML(data, () => res.status(200).send('Post added!'));
    });
});

app.post('/like', (req, res) => {
    const { title } = req.body;
    readXML((data) => {
        const post = data.posts.post.find((p) => p.title[0] === title);
        if (post) {
            post.likes[0] = parseInt(post.likes[0]) + 1;
            writeXML(data, () => res.status(200).send('Like added!'));
        } else {
            res.status(404).send('Post not found!');
        }
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
