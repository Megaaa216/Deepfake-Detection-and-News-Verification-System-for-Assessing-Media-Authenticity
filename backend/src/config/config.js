const requiredEnv = [
  "MONGO_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRE",
  "REFRESH_TOKEN_EXPIRE",
  "EMAIL_USER",
  "EMAIL_PASS"
];

const missingEnv = requiredEnv.filter((env) => !process.env[env]);

if (missingEnv.length > 0) {
  throw new Error(
    `Configuration error: Missing required environment variable(s): ${missingEnv.join(", ")}`
  );
}

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoose: {
    url: process.env.MONGO_URI,
  },
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    accessExpiration: process.env.ACCESS_TOKEN_EXPIRE,
    refreshExpiration: process.env.REFRESH_TOKEN_EXPIRE,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
};
