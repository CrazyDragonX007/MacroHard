const env = require("dotenv");
env.config();
module.exports = {
    db_string: process.env.DATABASE_CONNECTION_STRING,
    port: process.env.PORT,
    session_secret: process.env.SESSION_SECRET,
    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY
}