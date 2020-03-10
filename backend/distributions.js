const mongoose = require('mongoose');
const async = require('async');

const Transactions = mongoose.model('transactions');
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
	app.get('/api/distributions', requireLogin, async (req, res) => {
		await Transactions.find({ type: 'distribution' })
			.populate('_investor', 'email')
			.select('amount currency created_at _id _investor _ico')
			.exec(function(error, transactions) {
				if (error) res.status(422).send(error);
				else res.status(200).send(transactions);
			});
	});
};
