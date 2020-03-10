const mongoose = require('mongoose');
const async = require('async');

const Transactions = mongoose.model('transactions');
const requireLogin = require('../middlewares/requireLogin');
const sendMail = require('../services/sendMail');

module.exports = app => {
	app.get('/api/withdrawals', requireLogin, async (req, res) => {
		await Transactions.find({ type: 'withdraw' })
			.populate('_investor', 'email country')
			.sort({ created_at: -1 })
			.exec(function(error, transactions) {
				if (error) res.status(422).send(error);
				else res.status(200).send(transactions);
			});
	});

	// withdrawals upload
	app.post('/api/withdrawalsUpload', requireLogin, async (req, res) => {
		const transactions = req.body;
		let data = [];
		if (transactions.length > 0) {
			data = await transactions.map(async item => {
				const transaction = await Transactions.findById(item.id);
				transaction.status = item.status_name;
				transaction.txId = item.txId ? item.txId : transaction.txId;
				await transaction.save();
				return transaction;
			});
			Promise.all(data).then(results => {
				res.status(200).send(results);
			});
		} else {
			res.status(400).send({ error: 'Missing parameter' });
		}
	});
	app.put('/api/transaction', async (req, res) => {
		await Transactions.findById(req.body._id)
			.populate('_investor', 'email firstName')
			.populate('_ico', 'symbol name')
			.exec((err, transaction) => {
				const status = req.body.status;
				if (
					transaction.type == 'withdraw' &&
					transaction.status == 'pending' &&
					status == 'confirmed'
				) {
					const data = {
						email: transaction._investor.email,
						tp_name: 'Withdrawal successful',
						global_merge_vars: [],
						tags: ['withdrawal successful']
					};
					sendMail(data);
				}

				if (
					transaction.type == 'withdraw' &&
					transaction.status == 'pending' &&
					status == 'cancelled'
				) {
					const data = {
						email: transaction._investor.email,
						tp_name:
							'Withdrawal request unsuccessful: Confirmation email expired',
						global_merge_vars: [
							{
								name: 'ICOSYMBOL',
								content: transaction._ico.symbol
							},
							{
								name: 'FIRSTNAME',
								content: transaction._investor.firstName
							}
						],
						tags: [
							'withdrawal request unsuccessful: confirmation email expired'
						]
					};
					sendMail(data);
				}
				transaction.status = status;
				transaction.save((error, tres) => {
					if (err) {
						res.status(422).send(err);
					} else {
						res.status(200).send({ success: true });
					}
				});
			});
	});
};
