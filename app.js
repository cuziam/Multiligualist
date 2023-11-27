//built-in modules
const path = require("path");
//not built-in modules
const express = require("express");

//user-defined modules
const transRoutes = require("./routes/translators");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(transRoutes);

app.use(function (error, req, res, next) {
  res.status(500).render("500");
});
app.listen(4788, () => console.log("listening on port 4788"));
