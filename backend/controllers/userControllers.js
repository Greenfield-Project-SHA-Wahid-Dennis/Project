const User = require("../schemas/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = +process.env.SALT_ROUNDS;

// _________________get all users (for admin uses)_______________
let getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    console.log(`Error: ${error}`);
    res
      .status(500)
      .send(`backend: Failed to retrieve all users, please try again later`);
  }
};

// _________________ user log in_________________________
let logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const registeredUser = await User.findOne({ email });

    // empty fields check
    if (!email || !password) {
      return res.status(400).json({ message: "Both field are required" });
    }

    // email  check
    if (!registeredUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // password check
    const isPasswordCorrect = await bcrypt.compare(
      password,
      registeredUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password incorrect" });
    }

    // token implementation
    let payload = {
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      // image: registeredUser.image,
      id: registeredUser._id,
      icon: registeredUser.icon,
    };

    let token = jwt.sign(payload, process.env.SECRET_KEY);

    // console.log(token);

    // passed all filters to log in
    return res.status(200).json({ message: "Welcome back!", token });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).send(`backend: User not found, please try again later`);
  }
};

// _________________get one user by id__________________________
let getUserById = async (req, res) => {
  try {
    //1 const id = req.params.id;
    //1 const user = await User.findById({ _id: id });

    //2 const user = req.user;
    //2 const user = await User.findById(id).select('firstName lastName email image');
    const user = req.user; // Use the user information attached by the verifyToken middleware
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    return res.status(200).json({ message: "Here is the user!", user });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json(`backend: User not found, please try again later`);
  }
};

// _________________create new user and save in DB for register_______________

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

let addNewUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!!" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and contain both letters and numbers!",
      });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log({ message: "Email already exists" });
      return res.status(400).json({
        message: `Email already exists!, login or please register with different credentials`,
      });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashPassword,
      // image: null,
      icon: "😊", // Default icon
    };
    const createdUser = await User.create(newUser);

    // token implementation
    let payload = {
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      // image: createdUser.image,
      icon: createdUser.icon,
      id: createdUser._id,
    };

    let token = jwt.sign(payload, process.env.SECRET_KEY);

    // console.log(token);

    console.log({ message: "User created successfully" });

    return res.status(201).json({
      message: "User created successfully",
      user: createdUser,
      token,
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ message: `backend: Failed to create a new user` });
  }
};

//___________________________update user data________________
let updateUserData = async (req, res) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  try {
    const id = req.params.id;
    const { firstName, lastName, newPassword, oldPassword , icon } = req.body;
    console.log("Request Body:", req.body);
    // const oldPassword = req.body.oldPassword;
    // const newPassword = req.body.newPassword;
    const oldUser = await User.findById({ _id: id });

    if (!oldUser) {
      console.log(`User does not exist`);
      return res.status(404).json({ message: "User does not exist" });
    }

       // Optional Password Update
    let hashPassword = oldUser.password; // Default to existing password
    if (newPassword && oldPassword) {
      if (!passwordRegex.test(newPassword)) {
        return res.status(422).json({
          message: "Password must be at least 8 characters and contain both letters and numbers!",
        });
      }

      // Password check
      const isPasswordCorrect = await bcrypt.compare(oldPassword, oldUser.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Old password incorrect" });
      }

      hashPassword = await bcrypt.hash(newPassword, saltRounds);
    }

    // Prepare updated fields
    const updatedUser = {
      firstName: firstName || oldUser.firstName,
      lastName: lastName || oldUser.lastName,
      password: hashPassword,
      // image: image || oldUser.image,
      icon: icon || oldUser.icon, // Include icon field
    };

    const finalData = await User.findByIdAndUpdate({ _id: id }, updatedUser, {
      new: true, // Return the updated document
    });

    return res.status(200).json({ message: "User updated successfully", user: finalData });
  } catch (error) {
    console.error(`Error updating user: ${error}`);
    return res.status(500).json({ message: "Error updating user, try again later!" });
  }
};

//____________________delete user_______________________

let deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const userToDelete = await User.findByIdAndDelete({ _id: id });
    if (!userToDelete) {
      console.log(`User does not exist`);
      res.status(404).json({ message: "You are not authorized" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(`Error deleting user: ${error}`);
    res
      .status(500)
      .json({ message: "backend: Error deleting user, try again later!" });
  }
};

//____________________delete all users (for admin uses)____________________

let deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany();

    res.status(200).json({
      message: "All users deleted successfully",
      deletedCount: `${result.deletedCount} users deleted`,
    });
  } catch (error) {
    console.log(`Error deleting user: ${error}`);
    res
      .status(500)
      .json({ message: "backend: Error deleting user, try again later!" });
  }
};

module.exports = {
  getAllUsers,
  addNewUser,
  logIn,
  getUserById,
  updateUserData,
  deleteUser,
  deleteAllUsers,
};
