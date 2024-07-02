const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");

const PORT = process.argv[2] || 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.get("/health", (req, res) => {
  res.sendStatus(200);
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  console.log(`Received request from ${req.ip}`);
  console.log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  console.log(`Host: ${req.headers.host}`);
  console.log(`User-Agent: ${req.headers["user-agent"]}`);
  console.log(`Accept: ${req.headers.accept}`);

  const IP = req.ip;
  const USER_AGENT = req.headers["user-agent"];

  res.render("index", {
    PORT,
    IP,
    USER_AGENT,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
