import multer from "multer"
import path from "path"
import fs from "fs"
// const directoryPath = '/upload/images';

// if (!fs.existsSync(directoryPath)) {
//   fs.mkdirSync(directoryPath);
// }
// Ensure the /tmp/upload directory exists
const uploadPath = '/tmp/upload';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '_' +Date.now()+path.extname(file.originalname) )
      
    }
  })

  
// const storage = multer.diskStorage({
//     destination:"upload/images",
//     filename: function (req, file, cb) {
//     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '_' +Date.now()+path.extname(file.originalname) )
      
//     }
//   })
  
 export const upload = multer({ storage: storage })