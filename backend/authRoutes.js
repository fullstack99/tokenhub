const passport = require('passport');

module.exports = app => {
	app.get(
		'/auth',
		passport.authenticate('google', {
			scope: ['profile', 'email']
		})
	);

	app.get(
		'/api/get_id',
		passport.authenticate('googleId', {
			scope: ['profile', 'email']
		})
	);

	app.get('/api/callback', passport.authenticate('googleId'), (req, res) => {
		res.send(req);
	});

	app.get('/auth/callback', passport.authenticate('google'), (req, res) => {
		res.redirect('/investors');
	});

	app.get('/api/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	app.get('/api/current_user', (req, res) => {
		//res.send(req.session);
		res.send(req.user);
	});
};
