const mongoose = require('mongoose');
const requestify = require('requestify');
const async = require('async');
const moment = require('moment');

const Ico = mongoose.model('icos');
const Transactions = mongoose.model('transactions');
const Investor = mongoose.model('investors');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');
const ObjectId = mongoose.Types.ObjectId;

module.exports = app => {
	// post /ico --- create ico on Ico collection
	app.post('/api/ico', requireLogin, async (req, res) => {
		const {
			name,
			description,
			symbol,
			status,
			tokencurrency,
			usdRule,
			btcRule,
			ethRule,
			periods,
			documents,
			logo,
			target,
			website,
			ncAccountName,
			eth_cold_address,
			btc_cold_address,
			btc_hot_balance_min,
			eth_hot_balance_min,
			eth_hot_balance_max,
			btc_hot_balance_max
		} = req.body;
		let visible = false
		if(req.body.visible) {
			visible = true
		}
		if (
			!name ||
			!symbol ||
			!eth_cold_address ||
			!btc_cold_address ||
			!ncAccountName
		) {
			res.status(400).send({ error: 'Missing parameter' });
			return;
		}
		const ico = new Ico({
			name,
			description,
			symbol,
			status,
			target,
			tokencurrency,
			usdRule,
			btcRule,
			ethRule,
			periods,
			documents,
			logo,
			ncAccountName,
			website,
			ncAccountName,
			eth_cold_address,
			btc_cold_address,
			visible
		});

		ico.save(error => {
			if(error) {
				res.status(422).send(error);
			} else {
				const url = keys.lepricoin_api_url + 'icos';

				requestify
					.request(url, {
						method: 'POST',
						body: {
							name: name,
							eth_cold_address: eth_cold_address,
							btc_cold_address: btc_cold_address,
							eth_hot_balance_min: eth_hot_balance_min,
							btc_hot_balance_min: btc_hot_balance_min,
							eth_hot_balance_max: eth_hot_balance_max,
							btc_hot_balance_max: btc_hot_balance_max
						},
						auth: {
							username: keys.lepricoin_api_username,
							password: keys.lepricoin_api_password
						},
						dataType: 'json'
					})
					.then(async function(response) {
						const responseData = response.getBody();
		
						ico.lprId = responseData.pk;
						try {
							await ico.save();
							res.status(200).send(ico);
						} catch (err) {
							res.status(422).send(err);
						}
					})		
					.catch(err => {
						res.status(404).send(err.getBody());
					});
			}
		});
		
	});
	// get /ico --- get all records from Ico collection
	app.get('/api/ico', requireLogin, async (req, res) => {
		const icos = await Ico.find().select({
			created_at: false,
			updated_at: false
		});

		res.send(icos);
	});
	// get /ico/:icoId (ex: 5a39f3f96b650a1b0603891f)--- get a record where _id=icoID from Ico collection
	app.get('/api/ico/:icoId', requireLogin, async (req, res) => {
		const ico = await Ico.findById(req.params.icoId).select({
			created_at: false,
			updated_at: false
		});

		res.send(ico);
	});
	// get method /ico/:icoId/close  get data from Transactions collection where icoID=Transaction._ico and Transaction.status='confirmed'
	app.get('/api/ico/:icoId/close', requireLogin, async (req, res) => {
		const ico = await Ico.findById(req.params.icoId)
			.select('periods symbol')
			.exec();
		const currentPeriod = ico.periods[ico.periods.length - 1];

		const captable = await Transactions.aggregate([
			{
				$match: {
					_ico: new ObjectId(req.params.icoId),
					status: 'confirmed'
				}
			},
			{
				$group: {
					_id: '$_investor',
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
					},
					tokensRefund: {
						$sum: {
							$cond: [
								{ $eq: ['$type', 'refund'] },

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

		let data = [];
		data = await captable.map(async investment => {
			let temp = {};
			//console.log(investment);
			const investor = await Investor.findById(investment._id)
				.select('email')
				.exec();

			temp.investor = investment._id;
			temp.email = investor.email;
			temp.ico = req.params.icoId;
			temp.amount = Math.round(investment.tokensBuy - investment.tokensRefund);
			temp.currency = ico.symbol;
			temp.type = 'distribution';
			return temp;
		});
		Promise.all(data).then(results => {
			res.status(200).send(results);
		});
	});

	// post method /ico/:icoId/close/confirm
	// update a record where _id=IcoID by Ico.status='closed'
	app.post('/api/ico/:icoId/close/confirm', requireLogin, async (req, res) => {
		const confirmData = req.body;
		//console.log(confirmData);
		async.parallel(
			confirmData.map(item => {
				return callback => {
					createCaptable(item, callback);
				};
			}),
			(err, results) => {
				if (err) {
					res.status(422).send({ success: false, error: err });
				} else {
					Ico.findById(req.params.icoId, (error, ico) => {
						if (error) {
							res.status(422).send({ success: false, error: error });
						} else {
							ico.status = 'closed';
							ico.close_date = moment.utc(Date.now());
							ico.save(ierr => {
								if (ierr)
									res.status(422).send({ success: false, error: error });
								else
									res.status(200).send({ success: true, message: 'Success' });
							});
						}
					});
				}
			}
		);
	});
	app.put('/api/ico/:icoId', requireLogin, async (req, res) => {
		Ico.update({ _id: req.params.icoId }, req.body, function(error, ico) {
			if (error) {
				res.status(422).send({ success: false, error: error });
			} else {
				res.status(200).send({ success: true, message: 'Success' });
			}
		});
	});

	function createCaptable(item, callback) {
		const captable = new Transactions();
		captable._investor = item.investor;
		captable._ico = item.ico;
		captable.amount = item.amount;
		captable.type = item.type;
		captable.currency = item.currency;
		captable.txId = `${item.investor}_${item.ico}_${Date.now()}`;
		captable.xRate = 1;
		captable.status = 'confirmed';
		captable.save(err => {
			if (err) {
				return callback(err);
			} else {
				callback(null, 'create success');
			}
		});
	}
};
