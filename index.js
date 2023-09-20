const WebSocket = require("ws");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 클라이언트 연결 관리
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("클라이언트가 연결되었습니다.");

  // 새로운 클라이언트를 연결 목록에 추가
  clients.add(ws);

  // 클라이언트로부터 메시지 수신
  ws.on("message", (message) => {
    // 연결된 모든 클라이언트에게 메시지 전송
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  // 클라이언트 연결 종료
  ws.on("close", () => {
    console.log("클라이언트가 연결을 종료했습니다.");
    // 연결 종료된 클라이언트를 연결 목록에서 제거
    clients.delete(ws);
  });
});

// 정적 파일 서빙
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
