const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/db");
const query = require("./database/query");

const app = express();
app.use(bodyParser.json());

db.connectDB();

// Route to handle user registration.
app.post("/digistar/register", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ message: "Insert the required field" });
  }

  query
    .createUser(req.body)
    .then((user) => {
      return res.status(200).json({ message: `User ${user.name} Created` });
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: `Internal server error : ${error}` });
    });
});

// Route to handle fetching all users.
app.get("/digistar/users", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  query
    .getAllUsers()
    .then((users) => {
      return res.status(200).json(users);
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: `Internal server error : ${error}` });
    });
});

// Route to find users by name.
app.get("/digistar/users/search", (req, res) => {
  const searchedName = req.query.name;
  res.setHeader("Content-Type", "application/json");

  if (!searchedName) {
    return res.status(400).json({ message: "Please input the name" });
  }

  query
    .searchUserByName(searchedName)
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: `Internal server error : ${error}` });
    });
});

// Route to update users by id.
app.put("/digistar/users/:id", (req, res) => {
  const id = req.params.id;

  res.setHeader("Content-Type", "application/json");

  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ message: "Insert the required field" });
  }

  query
    .updateUser(id, req.body)
    .then((user) => {
      if (user) {
        return res.status(200).json({ message: `User ${user.name} updated` });
      } else {
        return res.status(400).json({ message: `User not found` });
      }
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: `Internal server error : ${error}` });
    });
});

// Route to delete users by id.
app.delete("/digistar/users/:id", (req, res) => {
  const id = req.params.id;
  res.setHeader("Content-Type", "application/json");

  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ message: "Insert the required field" });
  }

  query
    .deleteUser(id)
    .then((user) => {
      if (user) {
        return res.status(200).json({ message: `User ${user.name} deleted` });
      } else {
        return res.status(400).json({ message: `User not found` });
      }
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: `Internal server error : ${error}` });
    });
});

app.listen(3000, "localhost", () => {
  console.log("Server running at http://localhost:3000");
});
