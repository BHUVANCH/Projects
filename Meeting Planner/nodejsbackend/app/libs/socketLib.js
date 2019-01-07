const socketio = require('socket.io');
const io = new socketio();
const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('../libs/generatePasswordLib')
const tokenLib = require('../libs/tokenLib');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const EventModel = mongoose.model('Event');
const cron = require('node-cron');


let setServer = (server) => {

    let allOnlineUsers = [];
    let io = socketio.listen(server);
    let myio = io.of('/chat')

    myio.on('connection', (socket) => {
        console.log('on connection emitting verify user');
        socket.emit('verifyUser', '');

        socket.on('set-user', (authToken) => {
            console.log('set user called');
            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth error', { status: 500, error: 'Please provide correct authaToken' })
                } else {
                    console.log('user verified ..setting details');
                    let currentUser = user.data;
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
                    console.log(`${fullName} is Online`);
                    let userObj = { userId: currentUser.userId, fullName: fullName }
                    allOnlineUsers.push(userObj);
                    console.log(allOnlineUsers);
                }
            })
        })


        socket.on('notify-msg', (data) => {
            console.log('socket notify-msg called');
            console.log(typeof(data));
            myio.emit(data.receiverId, data) // my io local Instance

        })

        socket.on('disconnect', () => {
            console.log('user is disconnected');
            console.log(socket.userId);
            let removeIndex = allOnlineUsers.map((item) => { return item.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex, 1);
            console.log(allOnlineUsers);

        })

    })
cron.schedule('* * * * *', () => {
    NotifyEvents;
    console.log('_________Running  Every Minute_____________' + new Date())
  });
let NotifyEvents = () => {
    EventModel.find()
        .exec((err, result) => {
            if (err) {
                console.log(err);
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                console.log('No Users Found');
                let apiResponse = response.generate(true, 'Not Found', 404, null)
                res.send(apiResponse);
            } else {
                console.log('success');
                for (let x of result) {
                    for (let y of x.events) {
                        console.log(y);
                        console.log(y.start);
                        var t1 = new Date(y.start);
                        console.log(new Date());
                        var t2 = new Date();
                        var dif = t1.getTime() - t2.getTime();
                        var Seconds_from_T1_to_T2 = dif / 1000;
                        var n = Math.abs(Seconds_from_T1_to_T2);
                        console.log(n);
                        if (n <= 100) {
                            console.log('--------------------' + x.useremail);
                            console.log('---------------------' + n);
                            data = {
                                message: 'Meeting',
                                event: y
                            }
                            myio.emit(x.userId, data);
                        }
                    }
                }
            }
        })
} // end of usersList

}


module.exports = {
    setServer: setServer
}
