import fs from "fs"
export const fileDelete=(filepath)=>{
    console.log("Path in filedelete file",filepath)
    fs.unlink(filepath ,(err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
          return;
        }
      
        console.log(`File ${filepath} has been successfully deleted.`);
      });
}