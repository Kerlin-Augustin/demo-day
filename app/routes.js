const { Server } = require("mongodb");

module.exports = function(app, passport, db) {

  // normal routes ===============================================================
  
      // show the home page (will also have our login links)
      app.get('/', function(req, res) {
          res.render('index.ejs');
      });
  
      // PROFILE SECTION =========================
      app.get('/profile', isLoggedIn, function(req, res) {
          db.collection('messages').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('profile.ejs', {
              user : req.user,
              messages: result
            })
          })
      });

      app.get('/deposit', isLoggedIn, function(req, res) {
          db.collection('deposits').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('deposit.ejs', {
              user : req.user,
              messages: result
            })
          })
      });

      app.get('/invest', isLoggedIn, function(req, res) {
          db.collection('messages').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('invest.ejs', {
              user : req.user,
              messages: result
            })
          })
      });

      app.get('/sendmoney', isLoggedIn, function(req, res) {
          db.collection('sendingmoney').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('sendmoney.ejs', {
              user : req.user,
              messages: result
            })
          })
      });
      
      app.get('/settings', isLoggedIn, function(req, res) {
          res.render('settings.ejs', {
            user : req.user
        })
    });
  
      // LOGOUT ==============================
      app.get('/logout', function(req, res) {
          req.logout();
          res.redirect('/');
      });
  
  // message board routes ===============================================================
  
      app.post('/moneypool', (req, res) => {
        db.collection('users').insertOne({
          name: req.body.name,
          msg: req.body.msg, 
          thumbUp: 0, 
          thumbDown:0
        
        }, (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect('/profile')
        })
      })

      app.post('/linkbank', isLoggedIn, (req, res) => {
        db.collection('users').findOneAndUpdate({
          'local.email': req.user.local.email  
        }, 
        
        {$set: {
          'local.linkedAccountRT': req.body.routingTransit,
          'local.linkedAccountNumber' : req.body.accountNumber
        }},
        
        (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect('/settings')
        })
      })
      
      
      
      app.post('/transact', isLoggedIn, (req, res) => {
        // optionally if they try to withdraw to much money return not enough
        // talk to bank and do transaction (fake it because we do not have a real bank)
        let amount = req.body.depositWithdraw * req.body.amount
        db.collection('users').findOneAndUpdate({
          'local.email': req.user.local.email  
        }, 
        
        {$inc: {
          'local.accountBalance': amount
        }},
        
        (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect('/deposit')
        })
      })


  
      app.put('/moneypool', (req, res) => {
        db.collection('users')
        .findOneAndUpdate({
          _id: ObjectID(req.body._id)
        }, 
          {
          $set: {
            complete: true,
            thisUser : req.user.local.firstName
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
      })
  
      // app.delete('/messages', (req, res) => {
      //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
      //     if (err) return res.send(500, err)
      //     res.send('Message deleted!')
      //   })
      // })
  
      app.put('/moneypool', (req, res) => {
        db.collection('users', req.body)
        .findOneAndUpdate({
          _id: ObjectID(req.body._id)
        }, {
          $set: {
            complete: true,
            thisUser : req.user.local.firstName
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
      })
  
      app.delete('/messages', (req, res) => {
        db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
          if (err) return res.send(500, err)
          res.send('Message deleted!')
        })
      })
  
  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================
  
      // locally --------------------------------
          // LOGIN ===============================
          // show the login form
          app.get('/login', function(req, res) {
              res.render('login.ejs', { message: req.flash('loginMessage') });
          });
  
          // process the login form
          app.post('/login', passport.authenticate('local-login', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/login', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));
  
          // SIGNUP =================================
          // show the signup form
          app.get('/signup', function(req, res) {
              res.render('signup.ejs', { message: req.flash('signupMessage') });
          });
  
          // process the signup form
          app.post('/signup', passport.authenticate('local-signup', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/signup', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));
  
  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future
  
      // local -----------------------------------
      app.get('/unlink/local', isLoggedIn, function(req, res) {
          var user            = req.user;
          user.local.email    = undefined;
          user.local.password = undefined;
          user.save(function(err) {
              res.redirect('/profile');
          });
      });
  
  
  
  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();
  
      res.redirect('/');
  }
}