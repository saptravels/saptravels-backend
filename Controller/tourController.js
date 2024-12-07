const tourModel = require('../Model/tourModel');
const path=require('path');
const multer = require('multer');
const fs = require('fs');
const dir = path.join(__dirname, '../public/images');
console.log(dir)

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});
// /api/vi/tour
exports.getAllTour= async(req,res)=>{
    try{
        const tour = await tourModel.find({});
        res.json({
            success:true,
            tour
            
        })
    }
    catch(error){
        console.log("error tour",error.message)
        res.json({
            success:false,
            message:error.message
        })

    }
}

// /api/vi/createTour

exports.createTour = [
    upload.fields([
        { name: "imageUrl", maxCount: 1 },
        { name: "pdf", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { name, numberOfPersons, services, category } = req.body;

            // Ensure image and PDF file URLs are set correctly
            const imageUrl = req.files?.imageUrl ? `/images/${req.files['imageUrl'][0].filename}` : null;
            const pdf = req.files?.pdf ? `/images/${req.files['pdf'][0].filename}` : null;

            // Check if files are uploaded
            if (!imageUrl || !pdf) {
                return res.status(400).json({
                    success: false,
                    message: 'Image or PDF not uploaded'
                });
            }

          

             const servicesArray=Array.isArray(services) ? services : [services];


            // Convert `category` to an array if not already
            const categoryArray = Array.isArray(category) ? category : [category];

            // Create new tour object
            const newTour = new tourModel({
                name,
                numberOfPersons,
                imageUrl,
                pdf,
                services: servicesArray,
                category: categoryArray
            });

            // Save the new tour to the database
            await newTour.save();

            // Send success response
            res.status(200).json({
                success: true,
                tour: newTour
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
];


// http://localhost:8000/api/v1/updateTour/id


exports.updateTour=async(req,res)=>{
    try {
        const id = req.params.id;
        const updateTour = await tourModel.findByIdAndUpdate(id,{
                name:req.body.name,
                numberOfPersons:req.body.numberOfPersons,
                imageUrl:req.body.imageUrl,
                pdf:req.body.pdf,
                services:req.body.services,
                category:req.body.category
        },
        {new:true}
        
       );

       if(!updateTour){
        res.status(400).json({success:"false",message:"tour not found"})
       }
       res.status(200).json({
        success:true,
        tour:updateTour
    })
    
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// http://localhost:8000/api/v1/deleteTour/id

exports.deleteTour=async(req,res)=>{
    try{
        const id = req.params.id;
        const deleteTour = await tourModel.findByIdAndDelete({_id:id})
        res.status(201).json({
            success:true,
            deleteTour
        })
    }
  catch(err){
    res.status(500).json({
        success:false,
        message:err.message
    })
  }

}