import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    port: process.env.PORT || 8080,
    database_url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,
    bycript_salt_rounds: process.env.BYCRPT_SALT_ROUNDS || 12,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in: process.env.JWT_ACEESS_EXPIRES_IN!,//* This sign is used to ensure that the value is exist in env, other wise it will show error
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
}