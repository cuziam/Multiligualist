require("dotenv").config();
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

const systemSettingMessage = {
  role: "system",
  content: `You are a helpful AI assistant.
    Do not repeat the same answer.
    At first, Use the user's native language.
    `,
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
    userHistory.push({ role: "user", content: message }); //db에 업데이트
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: userHistory,
        max_tokens: 500,
      });
      const aiServerMessage = completion.choices[0].message;
      userHistory.push(aiServerMessage); //db에 업데이트
      console.log("userHistory", userHistory);
      callback(aiServerMessage.content);
    } catch {
      userHistory.push({
        role: "system",
        content: "AI 서버가 응답하지 않습니다.",
      });
      callback("AI 서버가 응답하지 않습니다.");
    }
  });
  socket.on("disconnect", () => {
    console.log("클라이언트 연결이 끊어졌습니다. 기록을 삭제합니다.");
    delete userHistories[socket.id];
  });
}

module.exports = { handleClientMessage, userHistories };
