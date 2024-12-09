
const multer = require("multer");

// Set up storage engine for multer (store files in 'uploads' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for each file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filter the uploaded file (optional: you can add more types or size limits)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]; // Modify as needed
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPEG, PNG, or PDF allowed."), false);
  }
  cb(null, true);
};

// Create the multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
}).single("uploadBill"); // 'uploadBill' is the field name from the frontend (adjust if needed)

module.exports = { upload };

