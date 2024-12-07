const mongoose = require('mongoose');
const tourSchema= new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    numberOfPersons:{
        type:Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
      },
    pdf:{
        type:String,
        required:true
    },
    services:[{
        name:{
            type:[String],
            required: true
        }
       
    }],
    category:{
        type:[String],
        required: true
    }


})

const tourModel = mongoose.model("tour",tourSchema);
module.exports = tourModel;