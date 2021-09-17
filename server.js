require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();

// Cors 
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    next();     //used for calling next middleware it is necessary
});

const PORT = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(express.json());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

mongoose.connect(

    //'mongodb://127.0.0.1:27017/',
    'mongodb+srv://rootmongodb:umakant@cluster0.yuffo.mongodb.net/ShareBox?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(success => {
    console.log("Connected to MongoDB!!!");

    app.listen(PORT, () => {
        console.log("server is running on " + PORT);
    });


}).catch(error => {
    console.log("NOT Connected!!!" + error);
});
