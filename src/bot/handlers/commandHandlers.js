import { createAndCheckNewUser } from "../services/db.js";
import { Stage } from "telegraf/scenes";

export default function handlers(bot) {
  // Первый заход в бота
  bot.command("start", async (ctx) => {
    const newUser = {
      username: ctx.message.from.username,
      user_id: ctx.message.from.id,
      language_code: ctx.message.from.language_code,
      first_name: ctx.message.from.first_name,
    };

    createAndCheckNewUser(newUser).then(async (res) => {
      if (res === "error") {
        return await ctx.telegram.sendMessage(
          ctx.message.chat.id,
          `Ошибка! Попробуйте перезапустить бота!`
        );
      } else {
        return await ctx.telegram.sendMessage(
          ctx.message.chat.id,
          `Приветствуем вас в боте Авито в телеграмме! Здесь вы можете добавить любой ваш профиль в авито и взаимодействовать
          с ним, например, читать сообщения пользователей и отвечать на них. Меню находится слева <. Удачи!`
        );
      }
    });
  });

  // GOOD
  bot.command("addprofile", Stage.enter("AddProfile"));
}
