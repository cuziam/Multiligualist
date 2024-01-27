//built-in modules
const path = require("path");
//not built-in modules
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

//cookie parser
const cookieParser = require("cookie-parser");

//user-defined modules
require("dotenv").config();
const { translateClientReq } = require("./src/server/translate");
const {
  sessionMiddleware: sessionHandler,
} = require("./src/server/sessionhandler");
const { errorController: errorHandler } = require("./src/server/errorhandler");
const {
  handleClientMessage,
  userHistories,
} = require("./src/server/clientMessageHandler");

//PORT
const PORT = process.env.PORT;

//미들웨어 사용
app.use(cookieParser()); //쿠키 파서 미들웨어
app.use(sessionHandler); //세션 미들웨어
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  //cors 허용
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// 웹소켓 연결 설정
io.on("connection", (socket) => {
  // 연결이 되었을 때
  console.log("새로운 클라이언트가 연결되었습니다.");

  socket.on("connectAiChat", () => {
    console.log("클라이언트가 AI 챗봇에 연결하였습니다");
    handleClientMessage(socket);
  });
  // 연결이 끊어졌을 때
  socket.on("disconnect", () => {
    console.log("클라이언트 연결이 끊어졌습니다.");
  });
});

//라우팅
app.get("/", (req, res) => {
  //index.html 보내기
  res.sendFile("index.html");
});

app.post("/translate", async (req, res) => {
  const data = req.body;
  try {
    const results = await translateClientReq(data, io);
    res.status(200).send("translation complete");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/healthcheck", (req, res) => {
  res.status(200).send("ok");
});

app.use(errorHandler);

server.listen(PORT, () => console.log(`listening on port ${PORT}...`));
