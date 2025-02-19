import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 5000,
  mongodb_url: process.env.MONGO_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_web_token: process.env.JWT_WEB_TOKEN,
  jwt_access_in: process.env.JWT_ACCESS_IN,
  jwt_refresh_token: process.env.JWT_REFRESH_TOKEN,

  sp: {
    sp_endpoint:process.env.SP_ENDPOINT,
    sp_username:process.env.SP_USERNAME,
    sp_password:process.env.SP_PASSWORD,
    sp_prefix:process.env.SP_PREFIX,
    sp_return_url:process.env.SP_RETURN_URL,
  }
};

