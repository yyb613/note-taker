const express = require('express');
const path = require('path');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        const notes = JSON.parse(data);
        res.json(notes)
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const uid = uuidv4();
    console.log(uid)
    newNote.id = uid;
    console.log(newNote)

    fs.readFile('./db/db.json', (err, data) => {
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if(err) throw err;
            res.send('Saved new Note');
        })
    })
});

app.listen(PORT, () => {
  console.log(`Notetaker app listening at http://localhost:${PORT}`);
});