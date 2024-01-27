//세션 미들웨어

//환경변수를 불러온다.
require("dotenv").config();
//session불러오기
const session = require("express-session");
//mongodbStore 생성자 함수를 호출할 때 session을 인자로 전달한다.
const MongodbStore = require("connect-mongodb-session")(session);

//새로운 mongodbStore 인스턴스를 생성한다.
const createSessionStore = () => {
  try {
    const mongodbStore = new MongodbStore({
      uri: process.env.MONGODB_URL,
      databaseName: "translators",
      collection: "session",
    });
    console.log("mongodbStore 연결 성공");
    return mongodbStore;
  } catch (err) {
    console.log(err);
  }
};

// sessionStore를 전달하여 sessionConfig를 생성한다.
const createSessionConfig = (sessionStore) => {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      name: "session",
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, //쿠키의 유효기간 7일
      sameSite: "lax",
      domain: ".translators24.com",
    },
  };
};

const sessionStore = createSessionStore();
const sessionConfig = createSessionConfig(sessionStore);
const sessionMiddleware = (req, res, next) => {
  if (req.path === "/" || req.path === "/translate") {
    session(sessionConfig)(req, res, next);
  } else {
    next();
  }
};

const initializeSessionConfig = async (req, res) => {
  // 요청에 세션 쿠키가 없으면 세션을 새로 생성한다.
  if (!req.session.initialized) {
    req.session.maxUsage = 20000;
    req.session.usage = 0;
    req.session.initialized = true;
    req.session.userAgent = req.headers["user-agent"] || "";
    await req.session.save();
  }
};
const CalculateUsage = async (req, res) => {
  const data = req.body;
  const usageLength = data[0].srcText.length;
  if (req.session.initialized) {
    try {
      const results = await translateClientReq(data);
      const successfulTranslations = results.filter((result) => result).length;
      const totalUsage = successfulTranslations * usageLength;

      if (req.session.usage + totalUsage >= req.session.maxUsage) {
        res.status(403).send("Forbidden: usage limit exceeded");
        return;
      }

      req.session.usage += totalUsage;
      await req.session.save();
      res.status(200).send("ok");
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
};

module.exports = {
  sessionMiddleware,
};
