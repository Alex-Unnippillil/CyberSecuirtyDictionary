const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'saved-searches.json');

function readSaved(){
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e){
    return [];
  }
}

function writeSaved(data){
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/saved-searches', (req, res) => {
  res.json(readSaved());
});

app.post('/api/saved-searches', (req, res) => {
  const { query, url } = req.body || {};
  if(!query || !url){
    return res.status(400).json({ error: 'query and url required' });
  }
  const saved = readSaved();
  saved.push({ query, url });
  writeSaved(saved);
  res.status(201).json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

