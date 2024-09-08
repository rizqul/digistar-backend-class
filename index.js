const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./database/db");
const query = require("./database/query");
const middleware = require("./middleware/jwt");

const app = express();
app.use(bodyParser.json());

db.connectDB();

// Route to handle user registration.
app.post("/digistar/register", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const user = req.body;

  if (!user.name || !user.age || !user.username || !user.password) {
    return res.status(400).json({ message: "Insert the required field" });
  }

  const hashPassword = await bcrypt.hash(user.password, 10);
  user.password = hashPassword;

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

async function login(username, password) {
  const user = await query.searchUserByUserName(username);

  if (!user) {
    return { message: "User not found" };
  }

  const validation = await bcrypt.compare(password, user.password);

  if (!validation) {
    return { message: "Invalid username and password" };
  }

  const key = "secret";
  const token = jwt.sign({ id: user.id }, key, { expiresIn: "1h" });

  return { token: token, user: user };
}

//Route to handle login
app.post("/digistar/login", async (req, res) => {
  const user = req.body;
  const validUser = await login(user.username, user.password);

  if (!validUser) {
    return res.status(400).json(validUser);
  }

  res.status(200).json(validUser);
});

// Route to handle fetching all users.
app.get("/digistar/users", middleware.verifyToken, (req, res) => {
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
