const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.get(
    "/getAllUsers",
    authMiddleware,
    userController.getAllUser
);

router.put(
    "/updateUser/:id",
    authMiddleware,
    userController.updateUser
);

router.delete(
    "/deleteUser/:id",
    authMiddleware,
    userController.deleteUser
);

router.patch(
    "/softDeleteUser/:id",
    authMiddleware,
    userController.softDeleteUser
);

router.post(
    "/addUserProfile",
    authMiddleware,
    userController.addUserProfile
);

module.exports = router;
