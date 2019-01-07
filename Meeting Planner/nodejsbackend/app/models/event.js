const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let eventSchema = new Schema({
    adminemail: { type: String, default: '' },
    adminId: { type: String, default: '' },
    useremail: { type: String, default: '' },
    userId: { type: String, default: '' },
    events: [{}],
    seen: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now() },
    modifiedOn: { type: Date, default: Date.now() },
})

mongoose.model('Event', eventSchema);

