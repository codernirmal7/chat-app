import fs from "fs";
import path from "path";

export const deleteLocalFile = (filePath: string): void => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    } else {
    }
  });
};