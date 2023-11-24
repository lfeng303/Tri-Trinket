const mysql = require('mysql');
const jwt = require('jsonwebtoken');
var Cart = require('../models/cart');
const bcrypt = require('bcryptjs');

const saltRounds = 8;
const db = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : "",
    database : process.env.DATABASE
})

exports.signup = async (req, res) => {
    console.log(req.body);
    
    const {email, user_name, password} = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error){
            console.log(error);
        }

        if (results.length > 0){
            return res.render('signup.hbs', {
                message: "That email has been taken"
            })
        } 
    });

    db.query('SELECT * FROM users WHERE user_name = ?', [user_name], (error, results) => {
        if (error){
            console.log(error);
        }

        if (results.length > 0){
            return res.render('signup.hbs', {
                message: "That username has been taken"
            })
        } 
        
    });
    let hashedPassword = await bcrypt.hash(password, saltRounds)
    
    
    console.log(hashedPassword);
    db.query('Insert INTO users SET ?', {email: email, user_name: user_name, password: hashedPassword}, (error, results)=>{
        if (error){
            console.log(error);
        }else{
            return res.render('index.hbs');
        }
    });  
    return;
}



exports.login = async (req, res) => {
    
    
    const {user_name, password} = req.body;
    
    
    db.query("SELECT * FROM users WHERE user_name = ?", [user_name], async (error, results, fields) => {
        
        
        if (error){
            console.log(error);
        }
        if (results.length > 0){
            const comparison = await bcrypt.compare(password, results[0].password)
            if (comparison){
                console.log(user_name);
                req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
                req.session.loggedin = true;
                req.session.username = user_name;
                return res.redirect('../');
            }else{
                console.log("fail");
                return res.render('login.hbs', {
                    message: "wrong password"
                });

            }
            
            
            
        }else{
            return res.render('login.hbs', {
                message: "invalid login"
            })
        }
    });
    
}



