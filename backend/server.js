const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'data.json');

function loadDB(){
  if(!fs.existsSync(DB_FILE)){
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}
function saveDB(db){
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// health check
app.get('/', (req, res) => {
  res.json({ status: 'DisciplineX API running' });
});

// log a completed set of reps for a user (adds to weekly total)
app.post('/api/log', (req, res) => {
  const { user, reps } = req.body;
  if(!user || typeof reps !== 'number') return res.status(400).json({ error: 'user and reps required' });

  const db = loadDB();
  if(!db.users[user]) db.users[user] = { reps: 0, streak: 0 };
  db.users[user].reps += reps;
  saveDB(db);
  res.json({ ok: true, total: db.users[user].reps });
});

// update a user's streak count
app.post('/api/streak', (req, res) => {
  const { user, streak } = req.body;
  if(!user || typeof streak !== 'number') return res.status(400).json({ error: 'user and streak required' });

  const db = loadDB();
  if(!db.users[user]) db.users[user] = { reps: 0, streak: 0 };
  db.users[user].streak = streak;
  saveDB(db);
  res.json({ ok: true });
});

// leaderboard sorted by reps, descending
app.get('/api/leaderboard', (req, res) => {
  const db = loadDB();
  const rows = Object.entries(db.users)
    .map(([user, data]) => ({ user, reps: data.reps, streak: data.streak }))
    .sort((a, b) => b.reps - a.reps)
    .slice(0, 20);
  res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DisciplineX backend running on port ${PORT}`));
