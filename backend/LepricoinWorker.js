const mongoose = require('mongoose');
const requestify = require('requestify');
const aasync = require('async');
const moment = require('moment');
const keys = require('../config/keys');

const Ico = mongoose.model('icos');
const Investor = mongoose.model('investors');
const Wallets = mongoose.model('wallets');
const Transactions = mongoose.model('transactions');
const xRate = mongoose.model('xRate');

const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
	// create a wallet record by lepricoin
	app.post('/lepricoin/createWallets', (req, res) => {
		const ico = req.body.ico;
		const user = req.body.user;
		//console.log(user);
		if (!ico) {
			res.status(400).send({ error: 'Missing parameter' });
		} else {
			const url = keys.lepricoin_api_url + 'accounts';
			requestify
				.request(url, {
					method: 'POST',
					body: {
						email: user.email,
						extra: user._id,
						ico: '6'
					},
					auth: {
						username: keys.lepricoin_api_username,
						password: keys.lepricoin_api_password
					},
					dataType: 'json'
				})
				.then(async function (response) {
					const responseData = response.getBody();
					//console.log(responseData);
					const _ico = ico;
					const btcAddress = responseData.addresses.filter(item => {
						return item.currency === 'btc';
					})[0].address;
					const ethAddress = responseData.addresses.filter(item => {
						return item.currency === 'eth';
					})[0].address;
					const _investor = user._id;
					const lprId = responseData.uuid;

					const wallets = new Wallets({
						_investor,
						_ico,
						btcAddress,
						ethAddress,
						lprId
					});

					try {
						await wallets.save();
						res.status(200).send(wallets);
					} catch (err) {
						res.status(422).send(err);
					}
				})
				.catch(err => {
					res.status(404).send(err.getBody());
				});
		}
	});
	// get Lepricoin transation of worker from Transacrion collection
	app.get('/api/worker/getLepricoinTransactions', (req, res) => {
		Wallets.find(function (req, wallets) {
			var allItems = [];
			aasync.each(
				wallets,
				function (wallet, callbackOne) {
					const url =
						keys.lepricoin_api_url +
						'crypto/transactions?address__account=' +
						wallet.lprId;
					requestify
						.request(url, {
							method: 'GET',
							auth: {
								username: keys.lepricoin_api_username,
								password: keys.lepricoin_api_password
							},
							dataType: 'json'
						})
						.then(function (response) {
							const responseData = response.getBody();
							aasync.each(
								responseData,
								function (transaction, callback) {
									Transactions.findOne({
										txId: transaction.txid
									}).then(async item => {
										if (item) {
											item._investor = wallet._investor;
											item._ico = wallet._ico;
											item.amount = transaction.amount;
											item.txId = transaction.txid;
											item.type = 'buy';
											item.currency = transaction.currency.toUpperCase();
											if (transaction.status === 'done') {
												item.status = 'confirmed';
											} else if (transaction.status === 'pending') {
												item.status = 'pending';
											}
											item.created_at = transaction.created_at;
											item.updated_at = new Date();
											//console.log(transaction.created_at);
											const xrate = await xRate.findOne({
												currency: transaction.currency.toUpperCase(),
												date: { $gte: new Date(transaction.created_at) }
											});
											item.xRate = xrate.rate;

											item.save(err => {
												if (err) {
													console.log(err);
													callback();
												} else {
													allItems.push(item);
													callback();
												}
											});
										} else {
											let new_item = new Transactions();
											//console.log(transaction);
											new_item._investor = wallet._investor;
											new_item._ico = wallet._ico;
											new_item.amount = transaction.amount;
											new_item.txId = transaction.txid;
											new_item.type = 'buy';
											new_item.currency = transaction.currency.toUpperCase();
											if (transaction.status === 'done') {
												new_item.status = 'confirmed';
											} else if (transaction.status === 'pending') {
												new_item.status = 'pending';
											}
											new_item.created_at = moment.utc(transaction.created_at);

											//new_item.created_at = new_item.created_at.UTC();
											new_item.updated_at = new Date();
											const testD = {
												currency: transaction.currency.toUpperCase(),
												date: {
													$gte: new_item.created_at
												}
											};
											//console.log(testD);
											//console.log(transaction.created_at);
											const xrate = await xRate.findOne({
												currency: transaction.currency.toUpperCase(),
												date: { $gte: new_item.created_at }
											});
											new_item.xRate = xrate.rate;
											new_item.save(err => {
												if (err) {
													console.log(err);
													callback();
												} else {
													allItems.push(new_item);
													callback();
												}
											});
										}
									});
								},
								function (err) {
									callbackOne();
								}
							);
						});
				},
				function (err) {
					if (err) {
						res.status(404).send(err);
					} else {
						res.status(200).send(allItems);
					}
				}
			);
		});
	});

	app.post('/lepricoin/createIcos', (req, res) => {
		const url = keys.lepricoin_api_url + 'icos';
		const ico = req.body.ico;
		requestify
			.request(url, {
				method: 'POST',
				body: {
					name: ico.name,
					eth_cold_address: ico.eth_cold_address,
					btc_cold_address: ico.btc_cold_address,
					eth_hot_balance_min: ico.eth_hot_balance_min,
					btc_hot_balance_min: ico.btc_hot_balance_min,
					eth_hot_balance_max: ico.eth_hot_balance_max,
					btc_hot_balance_max: ico.btc_hot_balance_max
				},
				auth: {
					username: keys.lepricoin_api_username,
					password: keys.lepricoin_api_password
				},
				dataType: 'json'
			})
			.then(async function (response) {
				const responseData = response.getBody();
				res.status(200).send(responseData);
			})
			.catch(err => {
				res.status(404).send(err.getBody());
			});
	});

};
