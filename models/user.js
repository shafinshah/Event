const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Event = require("./event.js");

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },

    Event:  
        {
             type: Schema.Types.ObjectId,
               ref: "Event",
           },

       
   

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);