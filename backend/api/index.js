const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // For rate limiting

const app = express();
const server = require('http').createServer(app);
app.use(cors());
app.use(express.json()); // Enable JSON body parsing

// Rate Limiting (Optional)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use('/peerjs', peerServer);

// In-memory store for username to Peer ID mapping
const usernameToPeerIdMap = {};

// Register a username with a Peer ID
app.post('/register-username', (req, res) => {
  let { username, peerId } = req.body;

  // Normalize username (lowercase and trim)
  username = username.toLowerCase().trim();

  if (!username || !peerId) {
    return res.status(400).send({ message: 'Username and Peer ID required' });
  }

  usernameToPeerIdMap[username] = peerId;
  console.log(`Registered: ${username} -> ${peerId}`);
  res.send({ message: 'Username registered successfully' });
});

// Retrieve a username from a Peer ID
app.get('/get-username', (req, res) => {
  const { peerId } = req.query;
  if (!peerId) {
    return res.status(400).send({ message: 'Peer ID required' });
  }

  const username = Object.keys(usernameToPeerIdMap).find(
    (key) => usernameToPeerIdMap[key] === peerId
  );

  if (username) {
    res.send({ username });
  } else {
    res.status(404).send({ message: 'Peer ID not found' });
  }
});

// Retrieve a Peer ID from a username
app.get('/get-peer-id', (req, res) => {
  let { username } = req.query;

  // Normalize username (lowercase and trim)
  username = username.toLowerCase().trim();

  if (!username) {
    return res.status(400).send({ message: 'Username required' });
  }

  const peerId = usernameToPeerIdMap[username];
  if (peerId) {
    res.send({ peerId });
  } else {
    res.status(404).send({ message: 'Username not found' });
  }
});

// Optional: Unregister a username and Peer ID if needed (e.g., on logout/disconnect)
app.post('/unregister-username', (req, res) => {
  let { username } = req.body;

  // Normalize username (lowercase and trim)
  username = username.toLowerCase().trim();

  if (!usernameToPeerIdMap[username]) {
    return res.status(404).send({ message: 'Username not found' });
  }

  delete usernameToPeerIdMap[username];
  console.log(`Unregistered: ${username}`);
  res.send({ message: 'Username unregistered successfully' });
});

// Handle call rejection notifications
app.post('/call-rejected', (req, res) => {
  const { callerId } = req.body; // Get the caller ID from the request body
  console.log(`Call rejected by ${callerId}`);
  res.send({ message: 'Call rejection acknowledged' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
