const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// roomId ごとに状態を分けるが、数に上限をつける
const states = new Map();
const MAX_ROOMS = 50; // 同時に記憶しておく room の最大数（個人用なら 50 で十分）

function getRoomId(req) {
  const fromQuery = req.query && req.query.roomId;
  const fromBody = req.body && req.body.roomId;
  return fromQuery || fromBody || "default";
}

function getStateForRoom(roomId) {
  if (!states.has(roomId)) {
    states.set(roomId, {
      players: [],
      currentPlayerId: null,
      updatedAt: Date.now(),
    });
  }
  return states.get(roomId);
}

// 古い room から順に捨てる
function pruneRooms() {
  if (states.size <= MAX_ROOMS) return;

  // updatedAt の古い順にソートして、余分な分を削除
  const entries = Array.from(states.entries()).sort(
    (a, b) => (a[1].updatedAt || 0) - (b[1].updatedAt || 0)
  );

  const excess = states.size - MAX_ROOMS;
  for (let i = 0; i < excess; i++) {
    const roomIdToDelete = entries[i][0];
    states.delete(roomIdToDelete);
    console.log("prune room:", roomIdToDelete);
  }
}

app.get("/", (req, res) => {
  const roomId = getRoomId(req);
  const state = getStateForRoom(roomId);

  console.log("GET /", { roomId, players: state.players.length });

  res.json({
    roomId,
    players: state.players,
    currentPlayerId: state.currentPlayerId,
  });
});

app.post("/", (req, res) => {
  const roomId = getRoomId(req);
  const { players, currentPlayerId } = req.body || {};
  const state = getStateForRoom(roomId);

  state.players = Array.isArray(players) ? players : [];
  state.currentPlayerId = currentPlayerId ?? null;
  state.updatedAt = Date.now();

  pruneRooms();

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
