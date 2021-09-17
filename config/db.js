//require('dotenv').config();
const mongoose = require('mongoose');
function connectDB() {
    // Database connection 🥳
    mongoose.connect("mongodb+srv://rootmongodb:umakant@cluster0.yuffo.mongodb.net/ShareBox?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        }).then(success => {
            console.log('Database connected 🥳🥳🥳🥳');
        }).catch(err => {
            console.log('Connection failed ☹️☹️☹️☹️');
        });
}

// mIAY0a6u1ByJsWWZ

module.exports = connectDB;