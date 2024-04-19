import dotenv from "dotenv";

dotenv.config({
  override: true,
  path: "./src/.env",
});

export const config = {
  PORT: process.env.PORT || 3000,
  MODE: process.env.MODE || "development",
};
