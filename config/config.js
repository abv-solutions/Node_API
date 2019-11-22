module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  URL: process.env.BASE_URL || 'http://localhost:5000',
  MONGODB_USER: process.env.MONGODB_USER || 'andreisuciu',
  MONGODB_PASS: process.env.MONGODB_PASS || 'acoustic',
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mern-ftiky.mongodb.net/node?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || 'abv_sol_andrei'
};
