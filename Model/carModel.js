const mongoose = require("mongoose")

const carSchema = new mongoose.Schema({
    carModel: {
        type: String,
        required: true,
        trim: true,
      },
      brand: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
      },
      seats: {
        type: Number,
        required: true,
      },
      availability: {
        type: Boolean,
        default: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        trim: true,
      },
      category: {
        type: [String],
        required: true,
        
      },
     
})

const CarModel= mongoose.model("Cars", carSchema)
module.exports= CarModel