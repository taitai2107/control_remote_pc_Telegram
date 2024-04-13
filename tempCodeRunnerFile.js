const exec = require("child_process").exec;
const screenshot = require("screenshot-desktop");
const notifier = require("node-notifier");
const path = require("path");
const os = require("os");
const fs = require("fs");
// const run = async () => {
//   const filee = path.join(__dirname, "aplica.txt");
//   const parts = await allAp();
//   fs.writeFileSync(filee, parts);
// };
// const allAp = async () => {
//   return new Promise((resolve, reject) => {
//     exec("tasklist", (err, stdout, stderr) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(stdout || stderr);
//       }
//     });
//   });
// };
// run();
const tempFileName = `temp_video_${Date.now()}.mp4`;
const tempFilePath = path.join(os.tmpdir(), tempFileName);
console.log(tempFilePath);
