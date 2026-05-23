const multer = require('multer');

// ─── Multer Configuration ────────────────────────────────────────────────────
// Using memory storage to easily process or upload to cloud services (e.g. S3/Cloudinary) later
const storage = multer.memoryStorage();

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png) are allowed!'), false);
  }
};

// Export pre-configured upload middleware
exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
