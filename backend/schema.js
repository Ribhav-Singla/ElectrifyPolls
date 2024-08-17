const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    roomId :{
        type: String,
        required: true
    },
    ipAddress:{
        type: String,
        required: true
    },
    vote:{
        type:Boolean,
        default: false
    }
},{timestamps:true})
 
module.exports = mongoose.model('Poll', pollSchema);