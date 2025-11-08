const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true 
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    phone: { 
        type: String, 
        required: true
    },
    dob: {
      type: Date,
      required: true
    },
    parentEmail: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSuperAdmin: {
      type: Boolean,
      default: false
    },
    adminRequest: {
        type: Boolean, 
        default: false 
    },
    adminApproved: {
        type: Boolean, 
        default: false 
    }
},
{timestamps:true});
module.exports = mongoose.model('User',UserSchema)