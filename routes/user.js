const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
// create user route
router.post("/", userController.createUser);
// update users data route
router.put("/:id",userController.updateUser);
// get users data route
router.get("/", userController.getUsers);
// Search users data route
router.get("/:id", userController.getUserById);
// Search users data route
router.delete("/:id", userController.removeUserById);
// login user routes
router.post("/login", userController.loginUser);

module.exports = router;
