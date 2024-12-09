const express = require("express");
const router = express.Router();
const {upload}  = require("../controllers/uploadController.js");

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
// router.post('/upload', upload.single("image"), (req, res) => {
//   console.log(req.file);
//   console.log(req.protocol)
  // upload(req, res, (err) => {
  //   if (err) {
  //     return res.status(400).send(err);  // Send error if any
  //   }
  //   res.status(200).send({ message: 'File uploaded successfully!', file: req.file });  // Send response with uploaded file data
  // });
// });


router.post('/upload', upload.single('img'), async(req, res, next) => {
  // var file = req.file;
  console.log(req.file)
  
  const url = req.protocol + '://' + req.get('host')
  console.log(req.protocol)
  console.log(req.file.filename)
     // photo model
    // const photo = new Photo({
    //     category: req.body.category,
    //     description:req.body.description,
    //     cameraType:req.body.cameraType,
    //     takenBy : req.body.takenBy,
    //     img : url + '/uploads/' + req.file.filename
    // });
    console.log(photo)
    // await sharp(req.file.buffer).resize({width:615,height:350}).toFile('./uploads')
    // .then(()=>{}).catch(err=>{console.log(err)})
    // await photo.save().then(result => {
    //     res.status(201).json({
    //         message: "Photo saved successfully!",
    //           photoCreated: {
    //           category: result.category,
    //           description:result.description,
    //           cameraType:result.cameraType,
    //           takenBy: result.takenBy,
    //           img: result.img
    //         }
    //     })
    // })
    // .catch(err => {
    //     console.log(err);
    //       res.status(500).send({
    //        upload_error: 'Error while uploading file ... Try again later.'
    //       });
    // })
});

module.exports = router;