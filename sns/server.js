const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());

const FILE = "posts.json";
let posts = [];

if (fs.existsSync(FILE)) {
  posts = JSON.parse(fs.readFileSync(FILE, "utf8"));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/post", (req, res) => {
  let { text, type, user } = req.body;

  if (!user) user = "anonymous";

  if (type === "binary") {
    text = text.replace(/■/g, "1").replace(/□/g, "0");
  }

  posts.push({
    user,
    text,
    type,
    good: 0
  });

  fs.writeFileSync(FILE, JSON.stringify(posts, null, 2));
  res.sendStatus(200);
});

app.post("/good/:id", (req, res) => {
  const id = Number(req.params.id);
  posts[id].good++;
  fs.writeFileSync(FILE, JSON.stringify(posts, null, 2));
  res.sendStatus(200);
});

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.listen(3000);