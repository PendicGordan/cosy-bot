const {ReS, shuffle, isInt, validateEmail } = require('../services/UtilService');
const moment                        				 = require('moment');

const TOMMOROW = "tomorrow";
const TODAY = "today";

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
	return ReS(res, shuffle(companies));
};
module.exports.getCompanies = getCompanies;


const checkDateAvailability = async function(req, res){

	if (!req.body.date) return ReS(res, { status: "false", message: "Missing date!" });
	if (!req.body.companyId) return ReS(res, { status: "false", message: "Missing Company!" });

	const userDateReservation = req.body.date.toLowerCase();
	const companyIdReservation = req.body.companyId;

	let momentDate;
	if(userDateReservation.indexOf(TOMMOROW) !== -1) {
		momentDate = moment(new Date(), "DD-MM-YYYY").add(1,'days');
	} else if(userDateReservation.indexOf(TODAY) !== -1) {
		momentDate = moment(new Date(), "DD-MM-YYYY");
	} else {
		momentDate = moment(userDateReservation, "DD-MM-YYYY");
		if(!momentDate.isValid()){
			return ReS(res, { status: "false", message: "Wrong date!" });
		}
		if (momentDate.isBefore()) {
			return ReS(res, { status: "false", message: "Date in the past!" });
		}
	}

	return ReS(res, { status: "true", message: "Alright, which time do you prefer?", reservations: [ "20:00", "21:00", "17:00" ] });
};
module.exports.checkDateAvailability = checkDateAvailability;

const checkTimeAvailability = async function(req, res){

	if (!req.body.date) return ReS(res, { status: "false", message: "Missing date!" });
	if (!req.body.time) return ReS(res, { status: "false", message: "Missing time!" });
	if (!req.body.companyId) return ReS(res, { status: "false", message: "Missing Company!" });

	const userTimeReservation = req.body.time.toLowerCase();
	const userDateReservation = req.body.date.toLowerCase();
	const companyIdReservation = req.body.companyId;

	let momentDate;
	if(userDateReservation.indexOf(TOMMOROW) !== -1) {
		momentDate = moment(new Date(), "DD-MM-YYYY " + userTimeReservation).add(1,'days');
	} else if(userDateReservation.indexOf(TODAY) !== -1) {

		momentDate = moment(new Date(), "DD-MM-YYYY " + userTimeReservation);
		momentDate = momentDate.hour(parseInt(userTimeReservation.split(":")[0]));
		momentDate = momentDate.minutes(parseInt(userTimeReservation.split(":")[1]));
		if(momentDate.isBefore()) {
			return ReS(res, { status: "false", message: "Time in the past!" });
		}
	} else {
		momentDate = moment(userDateReservation + " " + userTimeReservation, "DD-MM-YYYY HH:mm");

		if(!momentDate.isValid()) {
			return ReS(res, { status: "false", message: "Wrong time!" });
		}
	}
	let foundCompany = companies.filter(company => String(company.id) === companyIdReservation)[0];

	return ReS(res, { status: "true", message: "Success, your reservation has been made at " + momentDate.format('DD.MM.YYYY at HH:mm') + " in the " + foundCompany.name });
};
module.exports.checkTimeAvailability = checkTimeAvailability;



const selectCompany = async function(req, res){

	if (!req.body.company) return ReS(res, { status: "false", message: "Missing Company!" });
	let company = req.body.company;

	for (let i = 0; i < companies.length; i++) {
	    if(String(companies[i].id) === company) {
	    	  return ReS(res, { status: "true", message: "Okay" });
	    }
	}

  for (let i = 0; i < companies.length; i++){
			if(companies[i].name.toLowerCase().indexOf(company.toLowerCase()) !== -1 && req.body.exclude !== String(companies[i].id)) {
				  return ReS(res, {status: "maybe", message: "Did you mean " + companies[i].name + "?", company: companies[i]});
			}
	}

	return ReS(res, { status: "false", message: "Company not found!" });
};
module.exports.selectCompany = selectCompany;

const sendAmountOfPersons = async function(req, res){

	if (!req.body.numberOfPersons) return ReS(res, { status: "false", message: "Missing number of people!" });

	const numberOfPersons = req.body.numberOfPersons.toLowerCase();
	if(!isInt(numberOfPersons)) {
		return ReS(res, { status: "false", message: "Number of persons not parseable!" });
	}


	return ReS(res, { status: "true", message: "Success, you have registered a reservation for " + numberOfPersons + "!"});
};
module.exports.sendAmountOfPersons = sendAmountOfPersons;

const checkEmail = async function(req, res){
	if (!req.body.email) return ReS(res, { status: "false", message: "Missing the email!" });
	const email = req.body.email.toLowerCase();
	if(!validateEmail(email)) {
		return ReS(res, { status: "false", message: "Email not valid!" });
	}
	return ReS(res, { status: "true", message: "Email valid"});
};
module.exports.checkEmail = checkEmail;
