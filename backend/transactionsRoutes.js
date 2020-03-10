const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const async = require('async');
const Multer = require('multer');
const upload = Multer({
	storage: Multer.MemoryStorage,
	limits: {
		fileSize: 5 * 1024 * 1024 // no larger than 5mb
	}
});
const Investor = mongoose.model('investors');
const Ico = mongoose.model('icos');
const Transactions = mongoose.model('transactions');
const Captable = mongoose.model('captable');
const Wallet = mongoose.model('wallets');
const ObjectId = mongoose.Types.ObjectId;

module.exports = app => {
	app.get(
		'/api/investorTransactions/:investorId',
		requireLogin,
		async (req, res) => {
			///closed icos
			const closedIco = await Ico.find({ status: 'closed' }).select(
				'_id name status'
			);
			let closedResults = await Promise.all(
				_.map(closedIco, async ({ _id, name, status }) => {
					//get buy transactions
					const buyTransactions = await Transactions.find({
						_investor: req.params.investorId,
						_ico: _id,
						type: 'buy'
					}).select('currency amount');
					//get refund transactions
					const refundTransactions = await Transactions.find({
						_investor: req.params.investorId,
						_ico: _id,
						type: 'refund'
					}).select('currency amount');
					//get sum of buy transactions
					const totalBuy = _(buyTransactions)
						.groupBy('currency')
						.map((objs, key) => ({
							currency: key,
							total: _.sumBy(objs, 'amount')
						}))
						.value();
					//get sum of refund transactions
					const totalRefund = _(refundTransactions)
						.groupBy('currency')
						.map((objs, key) => ({
							currency: key,
							total: 0 - _.sumBy(objs, 'amount')
						}))
						.value();
					const unitedTransactions = _.union(totalBuy, totalRefund);
					//	get final remaining investments
					const totals = _(unitedTransactions)
						.groupBy('currency')
						.map((objs, key) => ({
							currency: key,
							total: _.sumBy(objs, 'total')
						}))
						.keyBy('currency')
						.mapValues('total')
						.value();

					const tokensAllocated = await Captable.findOne({
						_investor: req.params.investorId,
						_ico: _id,
						type: 'distribution'
					}).select('amount');
					return {
						_id,
						name,
						status,
						totals,
						tokensAllocated
					};
				})
			);

			///active Icos
			const activeIco = await Ico.find({ status: 'active' }).select(
				'_id name periods status'
			);
			let activeResults = await Promise.all(
				_.map(activeIco, async ({ _id, name, periods, status }) => {
					//get buy transactions
					const buyTransactions = await Transactions.find({
						_investor: req.params.investorId,
						_ico: _id,
						type: 'buy'
					}).select('currency amount xRate created_at');
					//get refund transactions
					const refundTransactions = await Transactions.find({
						_investor: req.params.investorId,
						_ico: _id,
						type: 'refund'
					}).select('currency amount xRate created_at');

					//get token amounts of buy transactions
					const buyTokens = _.sum(
						_.map(buyTransactions, transaction => {
							let period = periods.filter(period => {
								return (
									transaction.created_at > period.dateStart &&
									transaction.created_at < period.dateEnd
								);
							})[0];
							if (!period) {
								period = periods[periods.length - 1];
							}
							return transaction.amount * transaction.xRate / period.tokenPrice;
						})
					);
					//get token amounts of refund transactions
					const refundTokens = _.sum(
						_.map(refundTransactions, transaction => {
							let period = periods.filter(period => {
								return (
									transaction.created_at > period.dateStart &&
									transaction.created_at < period.dateEnd
								);
							})[0];
							if (!period) {
								period = periods[periods.length - 1];
							}
							return (
								0 - transaction.amount * transaction.xRate / period.tokenPrice
							);
						})
					);
					//get sum of buy transactions
					const totalBuy = _(buyTransactions)
						.groupBy('currency')
						.map((objs, key) => ({
							currency: key,
							total: _.sumBy(objs, 'amount')
						}))
						.value();
					//get sum of refund transactions
					const totalRefund = _(refundTransactions)
						.groupBy('currency')
						.map((objs, key) => ({
							currency: key,
							total: 0 - _.sumBy(objs, 'amount')
						}))
						.value();
					const unitedTransactions = _.union(totalBuy, totalRefund);
					//	get final remaining investments
					let totals = _(unitedTransactions)
						.groupBy('currency')
						.map((objs, key) => ({
							currency: key,
							total: _.sumBy(objs, 'total')
						}))
						.keyBy('currency')
						.mapValues('total')
						.value();

					//get final allocated tokens
					tokensAllocated = { amount: buyTokens - refundTokens };
					return {
						_id,
						name,
						status,
						totals,
						tokensAllocated
					};
				})
			);
			const response = _.union(activeResults, closedResults);

			res.send(response);
		}
	);
	app.get('/api/transactions', requireLogin, async (req, res) => {
		await Transactions.find({ $or: [{ type: 'buy' }, { type: 'refund' }] })
			.populate(['_investor', '_ico'])
			.exec((err, transactions) => {
				async.parallel(
					transactions.map(transaction => {
						return callback => {
							const investor =
								transaction._investor && transaction._investor._id;
							const ico = transaction._ico && transaction._ico._id;
							Wallet.findOne({ _investor: investor, _ico: ico }, function(
								err,
								wallet
							) {
								if (err || !wallet) {
									wallet = [];
								}
								const formattedTransaction = _.omit(transaction, [
									'_investor',
									'_ico'
								]);
								const formattedInvestor = transaction._investor || [];
								const formattedIco = transaction._ico || [];
								callback(null, {
									transaction: formattedTransaction,
									ico: formattedIco,
									investor: formattedInvestor,
									wallet: wallet
								});
							});
						};
					}),
					(err, results) => {
						if (err) {
							res.status(422).send(err);
						} else {
							res.status(200).send(results);
						}
					}
				);
			});
	});

	// transactions upload
	app.post('/api/transactionsUpload', requireLogin, async (req, res) => {
		const allData = req.body;
		let data = [];
		data = await allData.map(async item => {
			let new_transaction = new Transactions();
			const investor = await Investor.findOne({ email: item.email });
			const ico = await Ico.findOne({ symbol: item.symbol });
			new_transaction._ico = ico._id;
			new_transaction.amount = item.Amount;
			new_transaction.txId = item['txhash/transaction id'];
			new_transaction.type = 'buy';
			new_transaction.currency = item.Currency;
			new_transaction.status = 'confirmed';
			new_transaction.created_at = new Date(item.Date);
			new_transaction.xRate = 1;
			new_transaction.save();
			return new_transaction;
		});		
		Promise.all(data).then(results => {
			res.status(200).send(results);
		});
	});

	// post method /transactions with login
	// create a transaction record on Transactions collection
	app.post('/api/transactions', requireLogin, async (req, res) => {
		const { _ico, amount, xRate, currency, type, txId, status } = req.body;
		const _investor = req.user._id;
		const transaction = new Transactions({
			_investor,
			_ico,
			amount,
			xRate,
			currency,
			type,
			txId,
			status
		});

		try {
			await transaction.save();

			const ico = await Ico.findById(transaction._ico)
				.select('periods symbol')
				.exec();
			const currentPeriod = ico.periods[ico.periods.length - 1];

			const transactions = await Transactions.aggregate([
				{
					$match: {
						_ico: new ObjectId(transaction._ico),
						status: 'confirmed'
					}
				},
				{
					$group: {
						_id: '$_ico',
						tokensBuy: {
							$sum: {
								$cond: [
									{ $eq: ['$type', 'buy'] },

									{
										$divide: [
											{ $multiply: ['$amount', '$xRate'] },
											currentPeriod.tokenPrice
										]
									},
									0
								]
							}
						}
					}
				}
			]);

			if (currentPeriod.tokensCap >= transactions[0].tokensBuy) {
				ico.investmentsAllowed = false;
				await ico.save();
			}

			res.status(200).send(transaction);
		} catch (err) {
			res.status(422).send(err);
		}
	});

	// put methos transactions list xRate editable
	app.put('/api/transaction/:Id', requireLogin, async (req, res) => {
		Transactions.update({ _id: req.params.Id }, req.body, function(
			error,
			transaction
		) {
			if (error) {
				res.status(422).send({ success: false, error: error });
			} else {
				res.status(200).send({ success: true, message: 'Success' });
			}
		});
	});

	// get distribution tokens in transactions by ico + investor
	app.get('/api/investorTokens/:investorId', requireLogin, async (req, res) => {
		const icos = await Ico.find().select('_id name symbol');
		let data = [];
		data = await icos.map(async ico => {
			let temp = {};
			const transaction = await Transactions.aggregate([
				{
					$match: {
						_investor: new ObjectId(req.params.investorId),
						_ico: new ObjectId(ico._id),
						type: 'distribution'
					}
				},
				{
					$group: {
						_id: '$_ico',
						distribution: {
							$sum: '$amount'
						},
						withdrawn: {
							$sum: {
								$cond: [
									{
										$and: [
											{ $eq: ['$type', 'withdraw'] },
											{ $eq: ['$status', 'confirmed'] }
										]
									},
									'$amount',
									0
								]
							}
						},
						locked: {
							$sum: {
								$cond: [
									{
										$and: [
											{ $eq: ['$type', 'withdraw'] },
											{ $eq: ['$status', 'pending'] }
										]
									},
									'$amount',
									0
								]
							}
						}
					}
				}
			]);

			temp.ico = ico;
			if (transaction.length > 0) {
				temp.distribution = transaction[0].distribution;
				temp.withdrawn = transaction[0].withdrawn;
				temp.locked = transaction[0].locked;
				temp.available = temp.distribution - temp.withdrawn - temp.locked;
			} else {
				temp.distribution = 0;
				temp.withdrawn = 0;
				temp.locked = 0;
				temp.available = 0;
			}
			return temp;
		});
		Promise.all(data).then(results => {
			res.status(200).send(results);
		});
	});
};
