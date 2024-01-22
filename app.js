//built-in modules
const path = require("path");
//not built-in modules
const express = require("express");

//user-defined modules
const transRoutes = require("./routes/translators");

const app = express();
//html 렌더링을 위한 설정
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(transRoutes);

app.use(function (error, req, res, next) {
  console.error(error);
  res.status(500).send("Something broke!");
});
app.listen(4788, () => console.log("listening on port 4788"));
