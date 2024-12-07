
const CarModel = require('../Model/carModel');
const cabModel = require('../Model/AllcabsModel')
const bycrpt = require('bcryptjs')
const userModel = require('../Model/UserModel')

exports.getAllCar = async (req, res) => {
  try { 
    const cabs = await CarModel.find();
    if (!cabs.length) {
      return res.status(404).json({
        success: false,
        message: "No cabs found.",
        cabs:[]
      });
    }
    res.status(200).json({
      success: true,
      cabs,
    });
  } catch (error) {
    console.error("Error fetching cabs:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.getCarsByCategory = async (req, res) => {
  try {
    const Cars = await CarModel.find()
    res.json({
      success: true,
      Cars
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.createCar = async (req, res) => {
  try {
      const files = req.files || [];
      const { carModel, brand, price, seats, availability, description, category } = req.body;
      console.log("body" , req.body)

      // Validate required fields
      if (!carModel || !brand || !price || !seats || !availability || !category) {
          return res.status(400).json({
              success: false,
              message: "All fields are required."
          });
      }

      // Validate file upload
      if (!files.length) {
          return res.status(400).json({
              success: false,
              message: "Image upload failed. Please try again."
          });
      }

      // Assuming `req.files` contains an array of uploaded files
      const imageUrl = files[0].path; // Adjust this based on your file upload library's response structure

      // Create new car document
      const newCar = new CarModel({
          carModel,
          brand,
          price,
          seats,
          availability,
          imageUrl,
          category,
          description,
      });

      // Save to the database
      await newCar.save();

      res.status(201).json({
          success: true,
          newCar
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          error: error.message
      });
  }
};




exports.updateCar = async (req, res) => {
  try {
    const id = req.params.id;

    // Directly use the body data without any file upload handling
    const updatedCar = await CarModel.findByIdAndUpdate(
      id,
      {
        cabModel: req.body.cabModel,
        brand: req.body.brand,
        price: req.body.price,
        seats: req.body.seats,
        onRide: req.body.onRide, // Ensure you use the correct field name
        description: req.body.description,
        category: req.body.category,
        pricePerKm: req.body.pricePerKm, // Include pricePerKm data
        localTripType: req.body.localTripType, // Include localTripType data
        pricePerday: req.body.pricePerday // Include pricePerday data
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedCar) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.status(200).json({
      success: true,
      car: updatedCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params; // Extracting id from request parameters
    console.log("Deleting car with ID:", id);

    const deleteCar = await CarModel.findByIdAndDelete(id); // No need to use `{ _id: id }`, Mongoose simplifies this

    if (!deleteCar) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
      data: deleteCar,
    });
  } catch (error) {
    console.error('Error deleting car:', error.message);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

///register in 
exports.Register = async (req, res) => {
  try {
    // Assuming some registration logic here
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const newUser = new userModel({
      name, email, password, confirmPassword
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



exports.Login = async(req,res)=>{
  try {
    const {email,password}=req.body;
    
    const user = await userModel.findOne({email})
    if(!user){
      res.status(400).json({error:"userName is invalid"})
    }
    if(user.password != password){
      res.status(401).json({error:"password does not match"})
    }
    res.status(201).json({
      success:"true",
      messagee:"login succesFull"
    })
  } catch (error) {
    res.status(500).json({
      succes:"fail",
      error:error.message
    })
  }
}
