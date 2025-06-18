const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users = [];
const exercises = [];

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  const userId = uuidv4();
  const newUser = { _id: userId, username: username };
  users.push(newUser);
  res.json(newUser);
})

app.get('/api/users', (req, res) => {
  res.json(users);  
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const _id = req.params._id;
  const user = users.find(u => u._id === _id);
  if(!user){
    return res.status(404).json({ error: 'User not found' });
  }
  const {description, duration, date} = req.body;
  if (!description || !duration) {
    return res.status(400).json({ error: 'Description and duration are required' });
  }
  const exerciseDate = date ? new Date(date) : new Date();
  const exercise = {
    _id: user._id,
    username: user.username,
    description: description,
    duration: parseInt(duration),
    date: exerciseDate.toDateString()
  };
  exercises.push(exercise);
  res.json(exercise);
})

app.get('/api/users/:_id/logs', (req, res) => {
  const _id = req.params._id;
  const user = users.find(u => u.userId === _id);  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { from, to, limit } = req.query;
  let userExercises = exercises.filter(e => e._id === id);
  if(from){
    const fromDate = new Date(from);
    userExercises = userExercises.filter(e => new Date(e.date) >= fromDate);
  }
  if(to){
    const toDate = new Date(to);
    userExercises = userExercises.filter(e => new Date(e.date) <= toDate);
  }
  if (limit) {
    userExercises = userExercises.slice(0, parseInt(limit));
  }
  res.json({
    _id : user._id,
    username: user.username,
    count: userExercises.length,
    log: userExercises.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date    
    }))
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
