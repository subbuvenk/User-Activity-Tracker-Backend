var Activity = require('./models/activity');
var Login = require('./models/login');

module.exports = function(app, passport) {


	//HOME PAGE
	// app.get('/', function(req, res) {
	// 	res.render('index.ejs');
	// });

	//LOGIN GET
	app.get('/', function(req, res) {
		if (req.isAuthenticated())
			res.redirect('/profile');
		res.render('login.ejs', { message: "" });
	});

	//LOGIN PAGE POST
	app.post('/login', function(req, res, next) {
  		passport.authenticate('local-login', function(err, user, info) {
		    if (err) { 
		    	return next(err); 
		    }
		    if (!user) { 
		    	return res.render('login.ejs', info);
		    }
		    req.logIn(user, function(err) {
			    if (err) { return next(err); }
			    var log = new Object();
			    log.email = user.local.email;
			    log.action = "Login";
			    let now = (new Date()).toJSON();
				log.timestamp = now;
				Login.create(log, function (error, user) {
				if (error) {
					console.log(error);
				} 
			});
	      		return res.redirect('/profile');
		    });
  		})(req, res, next);
	});

	//SIGNUP FORM
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	//PROCESS SIGNUP FORM
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	//PROFILE PAGE
	app.get('/profile', isLoggedIn, getActivity, getLogin, function(req, res) {
		res.render('profile.ejs', { user: req.user, activity: req.activity, login: req.login});
	});

	//USER LOGOUT
	app.get('/logout', function(req, res) {
		var log = new Object();
	    log.email = req.user.local.email;
		req.logout();
		if(req.user)
			res.render('/', { message: "User data still present"});
	    let now = (new Date()).toJSON();
	    log.action = "Logout";
		log.timestamp = now;
		Login.create(log, function (error, user) {
		if (error)
			console.log(error);
		});
		res.redirect('/');
	});

	//CHECK LOGGED IN
	app.get('/loggedIn', function(req, res) {
		if(req.isAuthenticated()) 
	        res.status(200).send(req.user.local.email);
	    else
	        res.status(404).send("Please log in");
	});

	//CHROME EXTENSION ENDPOINT FOR LOGS
	app.post('/userLog', function(req, res) {
		if (req.isAuthenticated()) {
			req.body.email = req.user.local.email;
			Activity.create(req.body, function (error, user) {
				if (error) {
					console.log(error);
				} else {
					return res.send("success");
				}
			});
		}
		else {
			console.log("User is not logged in");
		}
	});

	//ROUTE MIDDLEWARE TO PASS USER LOGIN HISTORY
	function getLogin(req, res, next) {
		Login.find({'email': req.user.local.email}, 'timestamp action', function(err, login) {
			if (err)
				throw err;
			else
				req.login = login;
				return next();
		});
	}

	//ROUTE MIDDLEWARE TO PASS USER ACTIVITY HISTORY
	function getActivity(req, res, next) {
		Activity.find({'email': req.user.local.email}, 'timestamp activity text url title tag question', function(err, activity) {
			if(err) 
				throw err;
			else 
				req.activity = activity;
				return next();
		});
	}

	//ROUTE MIDDLEWARE USER LOGIN VERIFICATION
	function isLoggedIn(req, res, next) {

		//USER IS AUTHENTICATED
		if (req.isAuthenticated())
			return next();

		//IF NOT REDITECT TO HOME PAGE
		res.redirect('/');
	}
}
