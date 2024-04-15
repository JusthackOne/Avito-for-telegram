import express from "express";
import bodyParser from "body-parser";

import ngrok from "ngrok";
import { messagesHook } from "./services/apiService.js";

await ngrok.authtoken("2e03QjY3sJmxNwtLNUEx3Ucr0OO_5RQDvqDZTfs2mzyBM7XG3");

(async () => {
  let url;
  url = await ngrok.connect(3000);
  console.log("Ngrok туннель создан:", url);

  await messagesHook(url);
})();

export const app = express();
const PORT = 3000; // Порт вашего локального сервера

app.use(express.json());
app.use(bodyParser.json());

app.post("/", (req, res) => {
  console.log(
    "Получен POST запрос от Telegram бота:",
    req.body.payload.value.content
  );
  // Обработка запроса от Telegram бота здесь
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
