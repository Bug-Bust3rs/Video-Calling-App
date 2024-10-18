const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');

const app = express();

const server = require('http').createServer(app);
app.use(cors());

app.use(express.json()); // Enable JSON body parsing

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use('/peerjs', peerServer);

// In-memory store for username to Peer ID mapping
const usernameToPeerIdMap = {};

// Register a username with a Peer ID
app.post('/register-username', (req, res) => {
  const { username, peerId } = req.body;
  if (!username || !peerId) {
    return res.status(400).send({ message: 'Username and PeerID required' });
  }

  usernameToPeerIdMap[username] = peerId;
  console.log(`Registered: ${username} -> ${peerId}`);
  res.send({ message: 'Username registered successfully' });
});

// Retrieve a Peer ID from a username
app.get('/get-peer-id', (req, res) => {
  const { username } = req.query;
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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
