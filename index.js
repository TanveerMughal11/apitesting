// const express = require('express');
// const cors = require('cors');
// const taskRoutes = require('./routes/taskroutes');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.json({ message: 'API working' });
// });

// app.use('/api/tasks', taskRoutes);

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`SERVER RUNNING ON PORT ${PORT}`);
// });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskroutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API working' });
});

app.use('/api/tasks', taskRoutes);

// use env port (important for deployment later)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});