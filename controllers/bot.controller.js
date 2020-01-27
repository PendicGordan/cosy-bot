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

const TOMMOROW = "tommorow";
const TODAY = "today";

const checkDateAvailability = async function(req, res){

	if (!req.body.date) return ReE(res, { status: "false", message: "Missing date!" });
	if (!req.body.companyId) return ReE(res, { status: "false", message: "Missing Company!" });

	const userDateReservation = req.body.date.toLowerCase();
	const companyIdReservation = req.body.companyId;
	let momentDate;
	if(userDateReservation.indexOf(TOMMOROW) !== -1) {
		momentDate = moment(new Date(), "DD-MM-YYYY").add(1,'days');
	} else if(userDateReservation.indexOf(TODAY) !== -1) {
		momentDate = moment(new Date(), "DD-MM-YYYY");
	} else {
		momentDate = moment(userDateReservation, "DD-MM-YYYY");
	}

	if(momentDate.toString().indexOf("moment.invalid") === -1)
		return ReE(res, { status: "false", message: "Wrong date!" });

	return ReS(res, { status: "true", message: "Alright, which time do you prefer?", reservations: [ "20:00", "21:00", "17:00" ] });
};
module.exports.checkDateAvailability = checkDateAvailability;

const selectCompany = async function(req, res){

	if (!req.body.company) return ReE(res, { status: "false", message: "Missing Company!" });
	let company = req.body.company;

	console.log(company);

	return ReS(res, { status: "true", message: "Okay", company: 1 });
};
module.exports.selectCompany = selectCompany;
