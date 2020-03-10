const mongoose = require('mongoose');
const requestify = require('requestify');
const async = require('async');
const _ = require('lodash');

const AdminLog = mongoose.model('adminLog');
const AdminUser = mongoose.model('adminuser');
const keys = require('../config/keys');

module.exports = app => {
	app.post('/api/adminLog', async (req, res) => {
		const { sorted, page, pageSize, filtered } = req.body		
		let startDate, endDate, users = [], path = "", ip = "", sortVal = 'created_at', direction = -1, mail = ""

		if(sorted.length > 0) {
			sortVal = sorted[0].id
			direction = sorted[0].desc === true ? 1 : -1
		}

		await Promise.all(filtered.map(async item => {
			if(item.id == 'created_at') {
				startDate = !_.isNil(item.value.startDate) ? new Date(item.value.startDate) : null
				endDate = !_.isNil(item.value.endDate) ? new Date(item.value.endDate) : null
			}
			if(item.id == 'path') 
				path = item.value
			if(item.id == 'ip')
				ip = item.value
			if(item.id == 'user.email') {
				mail = item.value
				users = await AdminUser.find({email: { $regex: mail, $options: 'g' }}).select('_id').exec()
			}
		}))
		const length = await AdminLog.count().exec()

		AdminLog.find(
			{
				$and: [
					{path: { $regex: path, $options: 'g' }},
					{ip: { $regex: ip, $options: 'g' }},
					users.length > 0 ? {user: { $in: users }} : {},
					!_.isNil(startDate) ? {created_at: { $gte: startDate }} : {},
					!_.isNil(endDate) ? {created_at: { $lte: endDate }} : {}
				]
			}
		)
		.sort({ [sortVal]: direction })
		.limit(pageSize)
		.skip(pageSize * page)
		.populate('user', 'email _ico')
		.exec(function(error, adminLogs) {
			if (error) 
				res.status(422).send(error);
			else {
				res.status(200).send({
					data: adminLogs,
					length: length
				});
			}
		});
	});
}
