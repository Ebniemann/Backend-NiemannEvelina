import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destFolder = "";
    switch (file.fieldname) {
      case "profilePhoto":
        destFolder = "./uploads/photos";
        break;
      case "profileProduct":
        destFolder = "./uploads/products";
        break;
      case "profileDocument":
        destFolder = "./uploads/documents";
        break;
      default:
        destFolder = "./uploads";
    }
    cb(null, destFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + "-" + file.originalname;
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });
