const multer = require("multer");
const path = require("path");

// Hàm kiểm tra file là ảnh
const isImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Chỉ hình ảnh mới được chấp nhận"), false);
};

// Cấu hình lưu ảnh sản phẩm
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/products");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}${ext}`);
  },
});

// Cấu hình lưu ảnh user
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/user");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${Date.now()}${ext}`);
  },
});

// Tạo hai middleware riêng biệt
const uploadProduct = multer({
  storage: productStorage,
  fileFilter: isImage,
});

const uploadUser = multer({ storage: userStorage, fileFilter: isImage });

module.exports = {
  uploadProduct,
  uploadUser,
};
