const mongoose = require("mongoose");
const schema = require("./schema");

const users = mongoose.model("users", schema.userSchema);

const getAllUsers = async () => {
  return await users.find();
};

const createUser = async (user) => {
  return await users.create(user);
};

const getUserById = async (id) => {
  return await users.findById(id);
};

const updateUser = async (id, user) => {
  return await users.findByIdAndUpdate(id, user, { new: true });
};

const deleteUser = async (id) => {
  return await users.findByIdAndDelete(id);
};

const searchUserByName = async (name) => {
  return await users.find({ name: name });
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  searchUserByName,
};
