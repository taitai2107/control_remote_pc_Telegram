// const screenshot = require("screenshot-desktop");
// const fs = require("fs");
// const path = require("path");

// const currentDirectory = process.cwd();

// screenshot({ format: "png" })
//   .then((img) => {
//     const filePath = path.join(currentDirectory, "screenshot.png");

//     fs.writeFileSync(filePath, img);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const notifier = require("node-notifier");
function notifyUser() {
  notifier.notify({
    title: "Thông báo từ xxx",
    message: "hello",
  });
}
notifyUser();
