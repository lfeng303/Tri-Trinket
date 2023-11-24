const mysql = require("mysql");
const path = require("path");
const express = require('express');
const session = require('express-session');
const app = express();
const dotenv = require("dotenv");
var favicon = require('serve-favicon');

dotenv.config({path: './.env'});

const db = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : "",
    database : process.env.DATABASE
})

app.use(session({
    secret: 'secret',
    resave:false,
    saveUninitialized: true
}))


app.use(express.static(path.join(__dirname, './public')));

app.set('view-engine', 'hbs');
db.connect((error) => {
    if (error){
        console.log(error);
    }else{
        console.log("MYSQL connected")
    }
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use('/', require('./routes/pages.js'));

app.use('/auth', require('./routes/auth.js'));
//Parse url-encoded bodies (as sent by HTML forms)
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

app.listen(5000, () => {
    console.log("server started on Port 5000");
});