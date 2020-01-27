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

const getCompanies = async function(req, res){

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
	try{
		moment(userDateReservation, "DD-MM-YYYY").add(15,'days');
		if(userDateReservation.indexOf(TOMMOROW) !== -1) {
			momentDate = moment(new Date(), "DD-MM-YYYY").add(1,'days');
			// baza
		} else if(userDateReservation.indexOf(TODAY) !== -1) {
			momentDate = moment(new Date(), "DD-MM-YYYY");
			// baza
		} else {
			momentDate = moment(userDateReservation, "DD-MM-YYYY");
			// baza
		}
		if(momentDate.toString().indexOf("moment.invalid") === -1) console.log("aaaaaaaaaaaaaaa");
	} catch(err) {

		return ReE(res, { status: "false", message: "Wrong date!" });
	}

	console.log("MOMENT DATE: ", momentDate);


	return ReS(res, { status: "true", message: "Alright, which time do you prefer?", reservations: [ "20:00", "21:00", "17:00" ] });
};
module.exports.checkDateAvailability = checkDateAvailability;

const selectCompany = async function(req, res){

	if (!req.body.company) return ReE(res, { status: "false", message: "Missing Company!" });
	let company = req.body.company;

	companies.forEach(eachCompany => {
	    if(eachCompany.id === company) {
            return ReS(res, { status: "true", message: "Okay" });
        }
    });

    companies.forEach(eachCompany => {
        if(eachCompany.name.toLowerCase().indexOf(company.toLowerCase()) !== -1) {
            return ReS(res, { status: "maybe", message: "Did you mean " + eachCompany.name + "?", company: eachCompany });
        }
    });

	return ReE(res, { status: "false", message: "Company not found!" });
};
module.exports.selectCompany = selectCompany;
