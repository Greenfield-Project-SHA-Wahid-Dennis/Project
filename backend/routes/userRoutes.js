const express = require("express");
const router = express.Router();
const upload = require('../uploadBill/multerConfig.js');  // multer configuration - multer upload function

const {
  getAllUsers,
  addNewUser,
  logIn,
  getUserById,
  updateUserData,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/userControllers.js");
const verifyToken = require("../middleware/auth.js");
const { uploadBill } = require("../controllers/uploadController.js");

// routes require verify token
router.get("/allUsers", verifyToken, getAllUsers); //===> to retrieve all users data (just admin)
router.get("/:id", verifyToken, getUserById); //===> to retrieve one user by id
router.put("/updateUser/:id", verifyToken, updateUserData); //===> update user data
router.delete("/deleteUser/:id", verifyToken, deleteUser); //===> delete user profile (or account)
router.delete("/deleteAllUsers", verifyToken, deleteAllUsers); //===> delete all users (just admin)


// public routes
router.post("/login", logIn); //===> log in
router.post("/register", addNewUser); //===> register

// Upload route to handle the file upload
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send(err);  // Send error if any
    }
    res.status(200).send({ message: 'File uploaded successfully!', file: req.file });  // Send response with uploaded file data
  });
});

module.exports = router;