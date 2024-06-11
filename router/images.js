const app = require("express").Router();
const path = require("path");

app.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, `../public/uploads/${filename}`);
  // Attempt to send the file
  res.sendFile(filePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Handle the error
        // File not found
        res.status(404).send("File not found");
      } else {
        // Other types of errors
        console.error("Error sending file:", err);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

module.exports = app;
