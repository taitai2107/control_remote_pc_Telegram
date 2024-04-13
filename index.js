const axios = require("axios");
const { exec } = require("child_process");
const fs = require("fs");
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const idchat = process.env.ID_CHAT;

const runCommand = () => {
  exec("screenshot", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    let png = fs.readFileSync(stdout);
    sendTele(png);
  });
};

const sendTele = async (photo) => {
  try {
    await axios.post(`https://api.telegram.org/bot${API_KEY}/sendMessage`, {
      chat_id: idchat,
      photo: photo,
      caption: "ảnh chụp mh",
    });
    console.log("gửi thành công ");
  } catch (error) {
    console.log(error);
  }
};
runCommand();
