const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./user-model");
const restrict = require("../users/user-middleware");

const router = express.Router();


router.post("/register", async (req, res, next) => {
  try {
    // get username, password, role out from request body
    const { username, password, role } = req.body;

    // hash the password using bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);

    // save username, hashedPassword, role to the database -> database will return a userId
    const newUserId = await Users.addUser({
      username: username,
      password: hashedPassword,
      role: role,
    });

    // generate/encode/sign a JWT token from newUserId, username & role
    const token = jwt.sign(
      {
        userId: newUserId,
        username,
        role,
      },
      process.env.TOKEN_SECRET
    );

    // send the token to the front-end
    res.status(201).json({
      token,
      username, 
      role
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // get username & password from request body
    const { username, password } = req.body;

    // query the database to get the user by username (thre db result will come with the user's hashed password)
    const userFromDB = await Users.getUserByUsername(username);

    // If there is no user with given username found
    if (!userFromDB) {
      // send a invalid credential message to the front-end
      res.status(401).json({
        message: "Invalid credentials",
      });
      return; //return early
    }
    // console.log(userFromDB);
    // console.log(bcrypt.compareSync(password, userFromDB.password));

    // compare the user's saved hashed password with the password from the request body
    const isPasswordsMatched = bcrypt.compareSync(
      password,
      userFromDB.password
    );

    // if matches
    if (isPasswordsMatched) {
      // create a jwt token from userId, username & role
      const token = jwt.sign(
        {
          userId: userFromDB.id,
          username: userFromDB.username,
          role: userFromDB.role,
        },
        process.env.TOKEN_SECRET
      );
      // send the token to the front-end
      res.status(200).json({
        token,
      });
      // if not matches
    } else {
      // send a invalid credential message to the front-end
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    next(error);
  }
});


//-----------------------------------------------------------------------------
//  GETs all user accounts. (You must be logged in with instructor role)
// /api/users/getusers
//-----------------------------------------------------------------------------
router.get("/users", restrict("instructor"), async (req, res, next) => {
  try {
    const users = await db.allUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

//-----------------------------------------------------------------------------
// PUT updates user   /api/users/update/:id
//-----------------------------------------------------------------------------
router.put("/:id", restrict("instructor"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const changes = req.body;
    const user = db.findById(id);

    if (user) {
      db.updateUser(changes, id).then((updatedUser) => {
        res.json({
          Success: updatedUser + " User has been updated successfully.",
        });
      });
    } else {
      res.status(404).json({
        Error: "Could not find User with given id. please try another user id",
      });
    }
  } catch (err) {
    next(err);
  }
});

//-----------------------------------------------------------------------------
// DELETE   user   /api/users/delete/:id
//-----------------------------------------------------------------------------
router.delete("/:id", restrict("instructor"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteduser = db.removeUser(id);

    if (deleteduser) {
      res.json({
        Deleted: " User has been successfully deleted.",
      });
    } else {
      res.status(404).json({
        Error: "Could not find User with given id. Please try another User id.",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
