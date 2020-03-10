const mongoose = require('mongoose');
const Path = require('path-parser');
const { URL } = require('url');
const request = require('request');
const moment = require('moment');
const async = require('async');

const xRate = mongoose.model('xRate');
const Transactions = mongoose.model('transactions');

module.exports = app => {
	//    get method to create xrate on xRate collection.
	app.get('/api/xRate/create', async (req, res) => {
		// don't allow duplicate xRate data create!
		var now_date = new Date().toISOString().slice(0, 10);
		const xrates = await xRate.find().select({});
		for (var i = 0, len = xrates.length; i < len; i++) {
			if (now_date == xrates[i].date.toISOString().slice(0, 10)) {
				res.send({ inform: 'Today xRate data already exists!!!' });
				return;
			}
		}

		var currency = 'BTC';
		var rate;
		var date = new Date();
		var rate_ETH1;
		var rate_ETH2;
		var rate_ETH3;
		var rate_ETH;

		var rate_BTC1;
		var rate_BTC2;
		var rate_BTC3;
		var rate_BTC;

		var k1 = 0;
		var k2 = 0;

		url = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';
		request.get(url, (error, response, body) => {
			let json = JSON.parse(body);

			if (json[0] == null) {
				rate_BTC1 = '0.0';
			} else {
				rate_BTC1 = json[0].price_usd;
				if (parseFloat(rate_BTC1) >= 10) k1++;
			}
			//console.log("BTC:"+rate_BTC1);

			url = 'https://api.coinbase.com/v2/prices/BTC-USD/buy';
			request.get(url, (error, response, body) => {
				let json = JSON.parse(body);

				if (json.data == null) {
					rate_BTC2 = '0.0';
				} else {
					rate_BTC2 = json.data.amount;
					if (parseFloat(rate_BTC2) >= 10) k1++;
				}
				//console.log("BTC:"+rate_BTC2);

				url = 'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD';
				request.get(url, (error, response, body) => {
					let json = JSON.parse(body);

					if (json.result == null) {
						rate_BTC3 = '0.0';
					} else {
						rate_BTC3 = json.result.XXBTZUSD.a[0];
						if (parseFloat(rate_BTC3) >= 10) k1++;
					}

					//console.log("BTC:"+rate_BTC3);
					rate_BTC =
						(parseFloat(rate_BTC1) +
							parseFloat(rate_BTC2) +
							parseFloat(rate_BTC3)) /
						k1;
					//console.log("BTC:"+rate_BTC);

					rate = rate_BTC;

					currency = 'BTC';
					const xrat = new xRate({
						currency,
						rate,
						date
					});
					xrat.save();
				});
			});
		});

		url = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';
		request.get(url, (error, response, body) => {
			let json = JSON.parse(body);
			if (json[0] == null) {
				rate_ETH1 = '0.0';
			} else {
				rate_ETH1 = json[0].price_usd;
				if (parseFloat(rate_ETH1) >= 10) k2++;
			}
			//console.log(rate_ETH1);

			url = 'https://api.coinbase.com/v2/prices/ETH-USD/buy';
			request.get(url, (error, response, body) => {
				let json = JSON.parse(body);

				if (json.data == null) {
					rate_ETH2 = '0.0';
				} else {
					rate_ETH2 = json.data.amount;
					if (parseFloat(rate_ETH2) >= 10) k2++;
				}
				//console.log(rate_ETH2);

				url = 'https://api.kraken.com/0/public/Ticker?pair=XETHZUSD';
				request.get(url, (error, response, body) => {
					let json = JSON.parse(body);

					if (json.result == null) {
						rate_ETH3 = '0.0';
					} else {
						rate_ETH3 = json.result.XETHZUSD.a[0];
						if (parseFloat(rate_ETH3) >= 10) k2++;
					}
					//console.log(rate_ETH3);
					rate_ETH =
						(parseFloat(rate_ETH1) +
							parseFloat(rate_ETH2) +
							parseFloat(rate_ETH3)) /
						k2;
					//console.log(rate_ETH);

					rate = rate_ETH;

					currency = 'ETH';
					const xrat_eth = new xRate({
						currency,
						rate,
						date
					});
					xrat_eth.save();
					res.status(200).send(xrat_eth);
				});
			});
		});
	});

	//     get method  /xrate to get all records
	app.get('/api/xRate', async (req, res) => {
		const xrates = await xRate
			.find()
			.select({})
			.sort([['date', -1]])
			.exec();
		res.status(200).send(xrates);
	});

	//  post method /xRate/custom      filter xRate from all records.
	app.post('/api/xRate/custom', async (req, res) => {
		const xrates = await xRate.find({ rate: req.body.rate }).select({});
		res.send(xrates);
	});

	//  get method  /xrates/update      Update todays xRate from api
	app.get('/api/xrates/update', async (req, res) => {
		var Now_Date = new Date();
		var current_date = new Date().toISOString().slice(0, 10);
		const xrates = await xRate.find().select({});
		var ID_BTC;
		var ID_ETH;
		for (var i = 0, len = xrates.length; i < len; i++) {
			if (
				current_date == xrates[i].date.toISOString().slice(0, 10) &&
				xrates[i].currency == 'BTC'
			) {
				ID_BTC = xrates[i]._id;
			}
			if (
				current_date == xrates[i].date.toISOString().slice(0, 10) &&
				xrates[i].currency == 'ETH'
			) {
				ID_ETH = xrates[i]._id;
			}
		}

		const xrate0 = await xRate.find({ _id: ID_BTC }).select({});
		if (xrate0[0] == null) {
			console.log('There is no today xRate data!!!');
			res.send({
				Error:
					'No There is no today BTC xRate data!!! Please create xRate data at first!!!'
			});
			return;
		}
		const xrate1 = await xRate.find({ _id: ID_ETH }).select({});
		if (xrate1[0] == null) {
			console.log('There is no today xRate data!!!');
			res.send({
				Error:
					'No There is no today ETH xRate data!!! Please create xRate data at first!!!'
			});
			return;
		}

		var url;

		url = 'https://api.coinbase.com/v2/prices/BTC-USD/buy';
		request.get(url, (error, response, body) => {
			let json = JSON.parse(body);
			xRate.findById(ID_BTC, (err, xrate) => {
				xrate.rate = json.data.amount;
				xrate.date = Now_Date;
				xrate.save();
				//res.send(xrate);
			});
		});

		url = 'https://api.coinbase.com/v2/prices/ETH-USD/buy';
		request.get(url, (error, response, body) => {
			let json = JSON.parse(body);
			xRate.findById(ID_ETH, (err, xrate) => {
				xrate.rate = json.data.amount;
				xrate.date = Now_Date;
				xrate.save();
				res.send(xrate);
			});
		});
	});

	//  get method where can pass date and currency, return rate
	// ex:  /xRate/getRate?date=2017-12-29&currency=BTC
	app.get('/api/xRate/getRate/:currency/:date', async (req, res) => {
		var pass_date = req.params.date;
		var pass_currency = req.params.currency;
		const xrates = await xRate.find({ currency: pass_currency }).select({});
		//res.send(xrates);

		for (var i = 0, len = xrates.length; i < len; i++) {
			if (pass_date == xrates[i].date.toISOString().slice(0, 10)) {
				res.send({ rate: xrates[i].rate });
				return;
			}
		}
	});

	app.put('/api/xRate/update', async (req, res) => {
		const pass_ico = req.body.ico;
		const pass_date = req.body.date;
		const pass_currency = req.body.currency;
		const pass_xRate = req.body.xRate;
		const momentB = moment(pass_date).format('YYYY-MM-DD');

		const xtransactions = await Transactions.find().select({});

		async.parallel(
			xtransactions.map(xtransaction => {
				return callback => {
					if (
						momentB == moment(xtransaction.created_at).format('YYYY-MM-DD') &&
						pass_ico == xtransaction._ico &&
						pass_currency == xtransaction.currency
					) {
						xtransaction.xRate = pass_xRate;
						xtransaction.save(err => {
							if (err) callback(err);
							else callback(null, 'success');
						});
					} else {
						callback(null);
					}
				};
			}),
			(err, results) => {
				if (err) {
					res.status(422).send(err);
				} else {
					if (results.indexOf('success') > -1) {
						const newXtransaction = {
							ico: pass_ico,
							created_at: pass_date,
							currency: pass_currency,
							xRate: pass_xRate
						};
						res.status(200).send(newXtransaction);
					} else {
						res.status(404).send('Not found');
					}
				}
			}
		);
	});
};
