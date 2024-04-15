import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Создание экземпляра Axios с установленными параметрами
export const axiosInstance = axios.create({
  baseURL: process.env.avito_api, // базовый URL для запросов
  headers: {
    "Content-Type": "application/x-www-form-urlencoded", // пример другого заголовка
  },
});

export async function getToken(data) {
  data.grant_type = "client_credentials";
  return await axiosInstance.post("token", data).then((res) => {
    if (res.data?.access_token) {
      axiosInstance.defaults.headers[
        "Authorization"
      ] = `Bearer ${res.data.access_token}`;
      return res.data.access_token;
    }
    return false;
  });
}

export async function getProfileInfo() {
  return await axiosInstance.get("core/v1/accounts/self").then((res) => {
    if (res.data?.error) {
      return false;
    }
    return [
      res.data.email,
      res.data.id,
      res.data.name,
      res.data.phone,
      res.data.profile_url,
    ];
  });
}

export async function messagesHook(url) {
  const data = {
    url: url,
  };
  axiosInstance.defaults.headers[
    "Authorization"
  ] = `Bearer 1tNZNuMmQBuZzDUpp20bCA3lmFIKlNmCH9sw50Ic`;
  axiosInstance.defaults.headers["Content-Type"] = `application/json`;
  await axiosInstance
    .post("messenger/v3/webhook", data)

    .catch((err) => console.log(err));
}
