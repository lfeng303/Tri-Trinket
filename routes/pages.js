const { Console } = require("console");
const express = require("express");

const router = express.Router();

var fs = require('fs');
const { reset } = require("nodemon");
const { parse } = require("path");

var Cart = require('../models/cart');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
var team = JSON.parse(fs.readFileSync('./data/team.json', 'utf8'));
var orgs = JSON.parse(fs.readFileSync('./data/orgs.json', 'utf8'));


router.get('/', (req, res) => {
    
    if (req.session.loggedin) {
		// Output username
		
        res.render('index.hbs', {
            totalItems: req.session.cart.totalItems,
            products: products,
            loggedin: req.session.loggedin
        });
	} else {
		// Not logged in
        
        
        setTimeout(() => {
            res.render('login.hbs');
		    
        }, 1000);
        
        
	}
	
    
    
});



router.get('/signup', (req, res) => {
    res.render('signup.hbs');
});




router.get('/logout', (req, res) => {
    req.session.loggedin = false;
    return res.redirect('/');
});

router.get('/login', (req, res) => {
    res.render('login.hbs');
});


router.get('/cart', function(req, res) {
    
    
    if (!req.session.cart) {
      return res.render('cart.hbs', {
        products: null
      });
    }
    var cart = new Cart(req.session.cart);
    
    res.render('cart.hbs', {
        totalItems: req.session.cart.totalItems,
        username: req.session.username,
        products: cart.getItems(),
        totalPrice: cart.totalPrice
    });
});


  
router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    cart.remove(productId);
    req.amount -=1;
    req.session.cart = cart;
    res.redirect('/cart');

  });

router.get('/add/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = products.filter(function(item) {
      return item.id == productId;
    });
    cart.add(product[0], productId);
    req.session.cart = cart;
    req.session.amount += 1;
    
    
    res.redirect('/');
});

router.get('/product/:id', (req, res) => {
    var productId = req.params.id;
    var product = products.filter(function(item){
        return item.id == productId;
    });

    
    
    product = product[0];
    res.render('product.hbs', {
        product: product,
        totalItems: req.session.cart.totalItems
    });
    
    

    
});

router.get('/about', (req, res) => {
    res.render('about.hbs', {
        team: team,
        totalItems: req.session.cart.totalItems,
        organizations: orgs
    })
});
module.exports = router;