import dotenv from "dotenv";
dotenv.config();

import { axiosInstance } from "./services/apiService.js";
import { db, checkAndCreateTable } from "./services/db.js";
import { app } from "./server.js";

import { Scenes, Telegraf, session } from "telegraf";
import { AddProfile } from "./scenes/addProfile.js";

import messageHandler from "./handlers/messageHandlers.js";
import commandHandler from "./handlers/commandHandlers.js";

const bot = new Telegraf(process.env.BOT_TOKEN);
// инициализация сцен
const stage = new Scenes.Stage([AddProfile]);
bot.use(session());
bot.use(stage.middleware());

// Создание БД
checkAndCreateTable();

// Хэндлеры
messageHandler(bot);
commandHandler(bot);

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
