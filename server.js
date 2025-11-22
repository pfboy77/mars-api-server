const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ★ 重要：roomId ごとの状態を持つ
const states = {};
const DEFAULT_ROOM_ID = "default";

function getRoomId(req) {
  // クエリ優先、それがなければ body、その両方なければ "default"
  return (
    (req.query && req.query.roomId) ||
    (req.body && req.body.roomId) ||
    DEFAULT_ROOM_ID
  );
}

function getStateForRoom(roomId) {
  if (!states[roomId]) {
    states[roomId] = {
      players: [],
      currentPlayerId: null,
    };
  }
  return states[roomId];
}

app.get("/", (req, res) => {
  const roomId = getRoomId(req);
  const state = getStateForRoom(roomId);

  console.log("GET /", { roomId, players: state.players.length });

  res.json({
    roomId,
    ...state,
  });
});

app.post("/", (req, res) => {
  const roomId = getRoomId(req);
  const { players, currentPlayerId } = req.body || {};

  const state = getStateForRoom(roomId);
  state.players = players || [];
  state.currentPlayerId = currentPlayerId ?? null;

  console.log("POST /", {
    roomId,
    players: state.players.length,
    currentPlayerId: state.currentPlayerId,
  });

  res.json({ success: true, roomId });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
