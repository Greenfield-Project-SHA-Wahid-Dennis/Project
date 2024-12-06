const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const expenseRoutes = require("./routes/expenseRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes");  

const connection = require("./config/connection.js");
const port = process.env.PORT || 8080;

// middleware
const app = express();
app.use(express.json());
app.use(cors());

// user and expenses routes
app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/upload", uploadRoutes);  // Use the upload routes under the '/api' prefix



// ---- these section is added with multer implementation

// 404 Route
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});


app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});

