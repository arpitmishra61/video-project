const express = require("express")
const userController = require("../controllers/userController")
const UserRouter = express.Router()

const { getUser, createUser, updateUser, deleteUser } = userController
UserRouter.route("/:email").get(getUser).patch(updateUser).delete(deleteUser)
UserRouter.route("/").post(createUser)

module.exports = UserRouter