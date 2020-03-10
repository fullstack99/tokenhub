const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const Storage = require('@google-cloud/storage');
const keys = require('../config/keys');

const Investor = mongoose.model('investors');
const Ico = mongoose.model('icos');
const Transactions = mongoose.model('transactions');
const Captable = mongoose.model('captable');
const InvestorDoc = mongoose.model('investorDoc');


const storage = new Storage({
	projectId: keys.googleProjectID,
	keyFilename: './config/keyfile.json'
});
const docsBucket = storage.bucket('investors-docs');

module.exports = app => {
	app.get('/api/investors', requireLogin, async (req, res) => {
		const investors = await Investor.find()
			.sort({ created_at: -1 })
			.select(
			'_id email firstName lastName verification created_at country investAs defaultIco mfa accreditation'
			)
			.exec();
		res.status(200).send(investors);
	});

	app.get('/api/investor/:investorId', requireLogin, async (req, res) => {
		const investor = await Investor.findOne({ _id: req.params.investorId });

		res.send(investor);
	});

	app.get(
		'/api/switchMfa/:investorId/:mfaValue',
		requireLogin,
		async (req, res) => {
			const investor = await Investor.findOne({ _id: req.params.investorId });
			investor.mfa.enrolled = req.params.mfaValue;
			investor.save();
			res.send(investor);
		}
	);
	app.get(
		'/api/switchAml/:investorId/:amlValue',
		requireLogin,
		async (req, res) => {
			const investor = await Investor.findOne({ _id: req.params.investorId });
			investor.verification.amlOverride = req.params.amlValue;
			investor.save();
			res.send(investor);
		}
	);
	app.get(
		'/api/switchKyc/:investorId/:kycValue',
		requireLogin,
		async (req, res) => {
			const investor = await Investor.findOne({ _id: req.params.investorId });
			investor.verification.kycOverride = req.params.kycValue;
			investor.save();
			res.send(investor);
		}
	);

	app.get(
		'/api/switchAccreditation/:investorId/:accreditationValue',
		requireLogin,
		async (req, res) => {
			const investor = await Investor.findOne({ _id: req.params.investorId });
			investor.accreditation.accreditationOverride =
				req.params.accreditationValue;
			investor.save();
			res.send(investor);
		}
	);

	// list documents by investor id
	app.get('/api/getDocuments/:investorId', async (req, res) => {
		const investorId = req.params.investorId;
		const documents = await InvestorDoc.find({ _investor: investorId });
		let data = [];
		data = await documents.map(async document => {
			let temp = {};
			let expiresTime = new Date();
			expiresTime.setMinutes(expiresTime.getMinutes() + 2);
			const filepath = document.file.split('/');
			const bucketName = filepath[3];
			const bucket = storage.bucket(bucketName);
			const srcFilename = filepath[4] + '/' + filepath[5];

			const bucketFile = bucket.file(srcFilename);
			const signedUrls = await bucketFile.getSignedUrl({
				action: 'read',
				expires: expiresTime
			});
			temp.title = document.title;
			temp.country = document.country;
			temp.link = signedUrls[0];
			return temp;

		});
		Promise.all(data).then(results => {
			res.status(200).send(results);
		});

	})
};
