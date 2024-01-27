require("dotenv").config();
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

const systemSettingMessage = {
  role: "system",
  content:
    "You are a helpful AI assistant. you don't need greetings and just answer the question.",
};
const userHistories = {}; //temp db
//detect client message and send to AI server
async function handleClientMessage(socket) {
  // 사용자 기록이 없다면 초기화
  if (!userHistories[socket.id]) {
    userHistories[socket.id] = [systemSettingMessage];
  }
  socket.on("clientMessage", async (message, callback) => {
    console.log("클라이언트 메시지를 받았습니다.");
    const userHistory = userHistories[socket.id];
    console.log("userHistory", userHistory);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: userHistory,
      max_tokens: 700,
    });

    const aiServerMessage = completion.choices[0].message;
    userHistory.push({ role: "user", content: message }, aiServerMessage); //db에 업데이트
    console.log("userHistory", userHistory);
    callback(aiServerMessage.content);
  });
  socket.on("disconnect", () => {
    console.log("클라이언트 연결이 끊어졌습니다. 기록을 삭제합니다.");
    delete userHistories[socket.id];
  });
}

module.exports = { handleClientMessage, userHistories };
