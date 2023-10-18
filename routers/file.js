const express = require("express");
const ftp = require("basic-ftp");
const fs = require("fs");
const app = express();
const multer = require("multer");

const ftpOptions = {
  host: process.env.FILE_HOST,
  user: process.env.FILE_USER,
  password: process.env.FILE_PASS,
  secure: true,// Set to true for FTPS
  secureOptions: {
    rejectUnauthorized: false // Chấp nhận chứng chỉ tự ký (KHÔNG AN TOÀN!)
  }
};
// Cấu hình Multer để xử lý tải lên
const upload = multer({ dest: "uploads/" });

app.post("/upload-images", upload.array("images"), async (req, res) => {
  const client = new ftp.Client();

  try {
    await client.access(ftpOptions);

    const images = req.files; // Mảng chứa thông tin các hình ảnh đã tải lên

    const imageUrl = [];

    for (const image of images) {
      const localPath = image.path;
      const endcode = encodeURIComponent(image.originalname);
      const remotePath = `/files/image/${endcode}`;

      await client.uploadFrom(localPath, remotePath);
      fs.unlinkSync(localPath);
      const imageUrl1  = `https://files.modzozo.com/image/${endcode}`;
      imageUrl.push(remotePath)
    }

    res.status(200).send({
      status: 'success',
      data: {
        imageUrl: imageUrl,
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: 'fail',
      message: error.message
    });
  } finally {
    client.close();
  }
});

app.get("/download", async (req, res) => {
  const remotePath = req.query.path; // Đường dẫn tệp trên máy chủ FTP
  const localPath = `/home/noname/modyolo/downloads/${remotePath.split("/").pop()}`;

  const client = new ftp.Client();
  try {
    await client.access(ftpOptions);
    await client.download(fs.createWriteStream(localPath), remotePath);
    res.download(localPath, (error) => {
      if (error) {
        console.error({
          status: 'fail',
          message: 'Error during sending file'
        });
      } else {
        res.status(200).send({
          status: 'success',
          data: {
            downloadedUrl: localPath,
          }
        });

        fs.unlinkSync(localPath); // Xóa tệp cục bộ sau khi gửi
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: 'fail',
      message: error.message
    });
  } finally {
    client.close();
  }
});

module.exports = app
