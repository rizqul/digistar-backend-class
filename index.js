const http = require("http");
const url = require("url");
const { parse } = require("querystring");
const express = require("express");
const bodyParser = require("body-parser");

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;

//   const parsedUrl = url.parse(req.url, true);
//   res.setHeader("Content-Type", "application/json");
//   res.end(JSON.stringify(parsedUrl));
// });

const app = express();
app.use(bodyParser.json());

let users = [];

app.post("/digistar/register", (req, res) => {
  const user = {
    id: req.body.id,
    name: req.body.name,
  };

  users.push(user);

  res.setHeader("Content-Type", "application/json");
  res.status(200).send("User Added");
});

app.get("/digistar/users", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(users);
});

app.get("/digistar/users", (req, res) => {
  const query = req.query.name;
  const user = users.find(({ name }) => name == query);

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(user);
});

app.put("/digistar/users/:id", (req, res) => {
  const user = users.find(({ id }) => id == req.params.id);
  users[user.id] = req.body;

  res.setHeader("Content-Type", "application/json");
  res.status(200).send("User Updated");
});

app.delete("/digistar/users/:id", (req, res) => {
  const id = req.params.id;
  users = users.filter((user) => user[id] !== id);

  res.setHeader("Content-Type", "application/json");
  res.status(200).send("User Deleted");
});

app.listen(3000, "localhost", () => {
  console.log("Server running at http://localhost:3000");
});
