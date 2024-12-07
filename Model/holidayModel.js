const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
      },
    pdf:{
        type:String,
        required:true
    },
    services:[{
        name:{
            type:String,
            required: true
        },
     
    }],
    category:[{
        name:{
            type:String,
            required: true
        },
     
    }]
})

const holidayModel = mongoose.model("holiday",holidaySchema);
module.exports = holidayModel;

