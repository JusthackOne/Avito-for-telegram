import { Scenes } from "telegraf";
import { getProfileInfo, getToken } from "../services/apiService.js";
import { createAndCheckProfile } from "../services/db.js";

export const AddProfile = new Scenes.WizardScene(
  "AddProfile", // first argument is Scene_ID, same as for BaseScene
  async (ctx) => {
    ctx.wizard.state.profileData = {};
    let msg = await ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Введите client_id из настройки интеграций Авито вашего профиля`
    );
    ctx.wizard.state.messageToDelete = [];
    ctx.wizard.state.messageToDelete.push(msg.message_id);
    return ctx.wizard.next();
  },
  async (ctx) => {
    // validation example
    if (ctx.message.text.length < 1) {
      let msg = ctx.reply("Пожалуйста, введите корректный client_id");
      ctx.wizard.state.messageToDelete.push(msg.message_id);
      return;
    }
    ctx.wizard.state.profileData.client_id = ctx.message.text;
    ctx.wizard.state.profileData.user_id = ctx.message.chat.id;
    let msg = await ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Введите client_secret из настройки интеграций Авито вашего профиля`
    );
    ctx.wizard.state.messageToDelete.push(msg.message_id);
    return ctx.wizard.next();
  },
  async (ctx) => {
    // validation example
    if (ctx.message.text.length < 1) {
      let msg = ctx.reply("Пожалуйста, введите корректный client_secret");
      ctx.wizard.state.messageToDelete.push(msg.message_id);
      return;
    }
    ctx.wizard.state.profileData.client_secret = ctx.message.text;

    const res = await getToken(ctx.wizard.state.profileData);

    if (res) {
      ctx.wizard.state.profileData.token = res;
      let msg = await ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Введите небольшое описание (максимум 20 символов) для чего нужен данный профиль`
      );
      ctx.wizard.state.messageToDelete.push(msg.message_id);
      return ctx.wizard.next();
    }
    let msg = await ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Некорректный данные, профиль не найден, попробуйте ещё раз.`
    );
    ctx.wizard.state.messageToDelete.push(msg.message_id);
    return ctx.wizard.back();
  },
  async (ctx) => {
    // validation example
    if (ctx.message.text.length > 20) {
      let msg = ctx.reply("Слишком длинное описание");
      ctx.wizard.state.messageToDelete.push(msg.message_id);
      return;
    }
    const res = await getProfileInfo();
    ctx.wizard.state.profileData.description = ctx.message.text;
    ctx.wizard.state.profileData.email = res[0];
    ctx.wizard.state.profileData.avito_id = res[1];
    ctx.wizard.state.profileData.title = res[2];
    ctx.wizard.state.profileData.phone = res[3];
    ctx.wizard.state.profileData.photo_url = res[4];

    const isAddProfile = await createAndCheckProfile(
      ctx.wizard.state.profileData
    );
    console.log(isAddProfile);
    if (isAddProfile === "created") {
      await ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Профиль успешно добавлен!`
      );
    } else if (isAddProfile === "exist") {
      await ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Такой профиль уже существует у вас`
      );
    } else {
      await ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Случилась ошибка при создании профиля, попробуйте ещё раз`
      );
    }

    for (let i in ctx.wizard.state.messageToDelete) {
      await ctx.deleteMessage(ctx.wizard.state.messageToDelete[i]);
    }
    return ctx.scene.leave();
  }
);
