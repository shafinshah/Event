const { name } = require("ejs");
const mongoose = require("mongoose");
//const { create } = require("./listing");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: String,
   description: String,
    Date: {
type: Date.toString(),

    },
    user:String,
   email:String,
   

});
 
const Event = mongoose.model("Event",eventSchema);
module.exports = Event;

