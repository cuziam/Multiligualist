//built-in modules
const path = require("path");
//not built-in modules
const express = require("express");
// const session = require("express-session");
// const csrf = require("csurf");
//user-defined modules
const transRoutes = require("./routes/translators");
// const authMiddleWare = require("./middlewares/auth-middleware");
// const addCSRFTokenMiddleware = require("./middlewares/csrf-token-middleware");

// const mongoDbSessionStore = sessionConfig.createSessionStore(session);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: false }));

// app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));
// app.use(csrf());

// app.use(addCSRFTokenMiddleware);
// app.use(authMiddleWare);
//미들웨어 함수의 반환값을 얻으려는 게 아니라 함수를 직접 실행하려고 하는 것이라서 소괄호를 붙이지 않는다.

app.use(transRoutes);

app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

app.listen(4788, () => console.log("listening on port 4788"));
