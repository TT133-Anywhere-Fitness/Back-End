const db = require("../data/config");

async function addUser({ username, password, role }) {
  const [newUserId] = await db("users").insert({
    username,
    password,
    role,
  });

  return newUserId;
}

async function getUserByUsername(username) {
  return db("users").where("username", username).first();
}

function allUsers() {
  return db("users");
}

function findById(id) {
  return db("users")
  .select("id", "username")
  .where({ id })
  .first();
}

function findUser(filter) {
  return db("users")
  .select("id", "username", "password", "role")
  .where(filter);
}

function updateUser(changes,  id) {
  return db("users")
  .update(changes)
  .where({ id });
}


function removeUser(id){
  return db('users')
  .where('id', id)
  .del()
  .then(response => (!response ? null : response))
}

module.exports = {
  addUser,
  getUserByUsername,
  allUsers,
  findById,
  findUser, 
  updateUser, 
  removeUser
};
