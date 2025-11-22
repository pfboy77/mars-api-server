const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ★ 変更ポイント：state を1個ではなく、部屋ごとの map にする
//   key: roomId, value: { players, currentPlayerId }
const states = {};
const DEFAULT_ROOM_ID = "default";

// リクエストから roomId を取得するヘルパー
function getRoomId(req) {
  // 優先順位:
  // 1. クエリ (?roomId=xxx)
  // 2. ボディ (POST の JSON に roomId が入っている場合)
  // 3. 指定なしなら "default"
  return (
    (req.query && req.query.roomId) ||
    (req.body && req.body.roomId) ||
    DEFAULT_ROOM_ID
  );
}

// roomId に対応する state を取得（なければ初期値を作る）
function getStateForRoom(roomId) {
  if (!states[roomId]) {
    states[roomId] = {
      players: [],
      currentPlayerId: null,
    };
  }
  return states[roomId];
}

// --- GET "/" : 指定された roomId の state を返す ---
app.get("/", (req, res) => {
  const roomId = getRoomId(req);
  const state = getStateForRoom(roomId);
  res.json({
    roomId,
    ...state,
  });
});

// --- POST "/" : 指定された roomId の state を更新する ---
app.post("/", (req, res) => {
  const roomId = getRoomId(req);
  const { players, currentPlayerId } = req.body;

  const state = getStateForRoom(roomId);
  state.players = players;
  state.currentPlayerId = currentPlayerId;

  res.json({ success: true, roomId });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
