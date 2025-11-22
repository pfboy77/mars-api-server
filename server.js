const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// roomId ごとに状態を分ける（プレイヤー一覧だけ持つ）
const states = {};
const DEFAULT_ROOM_ID = "default";

function getRoomId(req) {
  const fromQuery = req.query && req.query.roomId;
  const fromBody = req.body && req.body.roomId;
  return fromQuery || fromBody || DEFAULT_ROOM_ID;
}

function getStateForRoom(roomId) {
  if (!states[roomId]) {
    states[roomId] = {
      players: [],
    };
  }
  return states[roomId];
}

// GET: 指定 room のプレイヤー一覧だけ返す
app.get("/", (req, res) => {
  const roomId = getRoomId(req);
  const state = getStateForRoom(roomId);

  console.log("GET /", { roomId, players: state.players.length });

  res.json({
    roomId,
    players: state.players,
  });
});

// POST: 指定 room のプレイヤー一覧だけ更新
app.post("/", (req, res) => {
  const roomId = getRoomId(req);
  const { players } = req.body || {};

  const state = getStateForRoom(roomId);
  if (Array.isArray(players)) {
    state.players = players;
  }

  console.log("POST /", {
    roomId,
    players: state.players.length,
  });

  res.json({ success: true, roomId });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
