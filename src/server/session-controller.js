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
      uri: "mongodb://127.0.0.1:27017",
      databaseName: "translators",
      collection: "session",
    });
    console.log("mongodbStore 생성");
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

module.exports = {
  sessionMiddleware,
};
