import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("db.db");

function createTableUsers() {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        first_name TEXT NOT NULL,
        username TEXT NOT NULL,
        language_code TEXT NOT NULL
      )`,
      [],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

function createProfiles() {
  return new Promise((resolve, reject) => {
    db.run(
      "CREATE TABLE IF NOT EXISTS  profiles (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, client_id TEXT NOT NULL, client_secret TEXT NOT NULL, token TEXT NOT NULL, email TEXT, avito_id INTEGER NOT NULL, phone TEXT, photo_url TEXT)",
      [],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

export async function checkAndCreateTable() {
  try {
    await createTableUsers();
    await createProfiles();
    console.log("Таблицы работают!");
    // Здесь вы можете продолжить свой код, который работает с таблицей 'users'
  } catch (err) {
    console.error("Ошибка при создании одной таблиц':", err);
  }
}

export async function createAndCheckNewUser(newUser) {
  function checkUser(newUser) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM users WHERE user_id = ?",
        [newUser.user_id],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  async function createUser(newUser) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (user_id, first_name, username, language_code) VALUES (?, ?, ?, ?)",
        [
          newUser.user_id,
          newUser.first_name,
          newUser.username,
          newUser.language_code,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve("created");
          }
        }
      );
    });
  }

  try {
    const rows = await checkUser(newUser);
    if (rows.length === 0) {
      return await createUser(newUser);
    } else {
      return "exist";
    }
  } catch (err) {
    console.error("Ошибка при добавлении человека в таблицу", err);
    return "error";
  }
}

export async function createAndCheckProfile(newProfile) {
  function checkProfile(newProfile) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM profiles WHERE (client_id, user_id)  = (?, ?)",
        [newProfile.client_id, newProfile.user_id],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  async function createProfile(newProfile) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO profiles (user_id, title, description, client_id, client_secret, token, email, avito_id, phone, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newProfile.user_id,
          newProfile.title,
          newProfile.description,
          newProfile.client_id,
          newProfile.client_secret,
          newProfile.token,
          newProfile.email,
          newProfile.avito_id,
          newProfile.phone,
          newProfile.photo_url,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve("created");
          }
        }
      );
    });
  }

  try {
    const rows = await checkProfile(newProfile);
    if (rows.length === 0) {
      return await createProfile(newProfile);
    } else {
      return "exist";
    }
  } catch (err) {
    console.error("Ошибка при добавлении человека в таблицу", err);
    return "error";
  }
}
