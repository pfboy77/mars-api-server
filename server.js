const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let state = {
  players: [],
  currentPlayerId: null,
};

app.get("/", (req, res) => {
  res.json(state);
});

app.post("/", (req, res) => {
  const { players, currentPlayerId } = req.body;
  state.players = players;
  state.currentPlayerId = currentPlayerId;
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});