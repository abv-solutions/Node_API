const mongoose = require('mongoose');
const config = require('./config');
const mongo = `mongodb+srv://${config.MONGODB_USER}:${config.MONGODB_PASS}@${config.MONGODB_URI}`;
// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.set('useFindAndModify', false).connect(mongo, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB: Connected...');
  } catch (err) {
    console.log(`MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
