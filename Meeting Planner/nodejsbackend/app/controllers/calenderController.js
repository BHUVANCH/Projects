const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('../libs/generatePasswordLib')
const crypto = require('crypto')

const nodemailer = require('nodemailer');
const socket = require('../libs/socketLib');
const cron = require('node-cron');


/* Models */
const UserModel = mongoose.model('User')
const token = require('../libs/tokenLib');
const AuthModel = mongoose.model('Auth');
const EventModel = mongoose.model('Event');

let setuserEvents = (req, res) => {
    console.log(req.body.adminemail);
    obj = JSON.parse(req.body.events)
    console.log(obj);
    let newEvent = new EventModel({
        adminemail: req.body.adminemail,
        adminId: req.body.adminId,
        useremail: req.body.useremail,
        userId: req.body.userId,
        events: obj,
    })
    newEvent.save((err, newEvent) => {
        if (err) {
            console.log(err);
            logger.error(err.message, 'calendarController: setEvents', 10);
            let apiResponse = response.generate(true, 'Failed to set new Event', 500, null);
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, 'created new Event', 200, newEvent);
            res.send(apiResponse);
        }
    })
} // end of setuserEvents

let getOnlyUserEvents = (req, res) => {
    console.log(req.body.useremail, req.body.userId);
    EventModel.find({ useremail: req.body.useremail, userId: req.body.userId })
        .exec((err, result) => {
            if (err) {
                console.log(err);
                logger.error(err.message, 'calendarController: getOnlyUserEvents', 10);
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Events Found');
                logger.error('No Events Found', 'calendarController: getOnlyUserEvents', 10);
                let apiResponse = response.generate(true, 'No Events Found', 404, null)
                res.send(apiResponse);
            } else {
                console.log('----------------');
                console.log(result);
                console.log('----------------');
                let apiResponse = response.generate(false, 'sucess', 200, result)
                res.send(apiResponse);
            }
        })
}

let getuserEvents = (req, res) => {
    console.log(req.body.useremail, req.body.adminemail);
    EventModel.find({ useremail: req.body.useremail, adminemail: req.body.adminemail })
        .exec((err, result) => {
            if (err) {
                console.log(err);
                logger.error(err.message, 'calendarController: getuserEvents', 10);
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Users Found');
                logger.error('No Events Found', 'calendarController: getuserEvents', 10);
                let apiResponse = response.generate(true, 'No Events Found', 404, null)
                res.send(apiResponse);
            } else {
                console.log(result);
                let apiResponse = response.generate(false, 'sucess', 200, result)
                res.send(apiResponse);
            }
        })
} // end of usersList


let deleteuserEvents = (req, res) => {
    console.log(req.body.useremail, req.body.adminemail);
    EventModel.remove({ useremail: req.body.useremail, adminemail: req.body.adminemail })
        .exec((err, result) => {
            if (err) {
                console.log(err);
                logger.error(err.message, 'calendarController: deleteuserEvents', 10);
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Users Found');
                logger.error('No Events Found', 'calendarController: deleteuserEvents', 10);
                let apiResponse = response.generate(true, 'Not Found', 404, null)
                res.send(apiResponse);
            } else {
                console.log('success');
                let apiResponse = response.generate(false, 'sucess', 200, null)
                res.send(apiResponse);
            }
        })
}

let deleteEvents = (req, res) => {
    EventModel.remove()
        .exec((err, result) => {
            if (err) {
                console.log(err);
                logger.error(err.message, 'calendarController: deleteEvents', 10);
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Users Found');
                logger.error('No Events Found', 'calendarController: deleteEvents', 10);
                let apiResponse = response.generate(true, 'Not Found', 404, null)
                res.send(apiResponse);
            } else {
                console.log('success');
                let apiResponse = response.generate(false, 'sucess', 200, null)
                res.send(apiResponse);
            }
        })
}



module.exports = {
    setuserEvents: setuserEvents,
    getuserEvents: getuserEvents,
    deleteEvents: deleteEvents,
    deleteuserEvents: deleteuserEvents,
    getOnlyUserEvents: getOnlyUserEvents
}