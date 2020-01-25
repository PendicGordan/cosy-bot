const {Users}                       = require('../models');
const {ReE, ReS, to, getAge }       = require('../services/UtilService');
const bcrypt                        = require('bcryptjs');
const validator                     = require('validator');
const randomstring                  = require('randomstring');
const moment                        = require('moment');

const hello = async function(req, res){
    console.log("Hello Endpoint", req.body);
    return ReS(res, {hehe:'hehe'});
};
module.exports.hello = hello;

const getCompanies = async function(req, res){
	const companies = [
		{
			id: 1,
			name: 'MOZAIK Cafe&Restaurant',
			address: 'Stuwerstrasse 20/18, 1020 Wien',
			image: 'https://cdn.werbifi.com/3/image6.jpg',
			rating: 5,
		},
		{
			id: 2,
			name: 'Schweizerhaus',
			address: 'Prater 116, 1020 Wien',
			image: 'https://www.vienna.at/2019/10/Schweizerhaus09-4-3-590945709-945x709.jpg',
			rating: 4,
		},
		{
			id: 3,
			name: 'Gasthaus Möslinger',
			address: 'Stuwerstrasse 13, 1020 Wien',
			image: 'https://www.delinski.at/_media/images/_at/restaurants/detail/gasthaus-moeslinger-2.cache1410184679.jpg',
			rating: 4,
		}
	];
	return ReS(res, companies);
};
module.exports.getCompanies = getCompanies;

const checkDateAvailability = async function(req, res){

	const userDateReservation = req.body.date;
	const companyIdReservation = req.body.companyId;

	//moment(userDateReservation, "DD-MM-YYYY").format(DATE_FORMAT)

	return ReS(res, companies);
};
module.exports.checkDateAvailability = checkDateAvailability;