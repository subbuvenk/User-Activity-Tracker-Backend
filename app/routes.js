module.exports = function(app, passport) {


	//HOME PAGE
	// app.get('/', function(req, res) {
	// 	res.render('index.ejs');
	// });

	//LOGIN GET
	app.get('/', function(req, res) {
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
	      		return res.redirect('/profile');
		    });
  		})(req, res, next);
	});

	// app.post('/login', passport.authenticate('local-login', {
	// 	successRedirect : '/profile',
	// 	failureRedirect : '/',
	// 	failureFlash : true
	// }));

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
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', { user: req.user});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		if(req.user)
			console.log('comes here!');
			res.render('/', { message: "User data still present"});
		res.redirect('/');
	});

	//CHECK LOGGED IN
	app.get('/loggedIn', function(req, res) {
		if(req.isAuthenticated()) 
	        res.status(200).send("Logged in as: " + req.user.local.email);
	    else
	        res.status(404).send("User not logged in");
	});

	app.post('/userLog', function(req, res) {
		if (req.isAuthenticated()) {
			console.log(req.body);
		}
		else
			console.log(req.body);
	});

	//ROUTE MIDDLEWARE USER LOGIN VERIFICATION
	function isLoggedIn(req, res, next) {

		//USER IS AUTHENTICATED
		if (req.isAuthenticated())
			return next();

		//IF NOT REDITECT TO HOME PAGE
		res.redirect('/');
	}
}