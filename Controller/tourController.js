const tourModel = require('../Model/tourModel');
const path=require('path');
const multer = require('multer');
const fs = require('fs');



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
    async (req, res) => {
      try {
        const files = req.files || [];
        const { name, numberOfPersons, services, category } = req.body;
  
        // Ensure image and PDF file URLs are set correctly
        const imageFile = files.find(file => file.fieldname === 'imageUrl');
        const pdfFile = files.find(file => file.fieldname === 'pdf');
  
        // Check if files are uploaded
        if (!imageFile || !pdfFile) {
          return res.status(400).json({
            success: false,
            message: "Both image and PDF are required."
          });
        }
  
        // Convert `services` and `category` to arrays if not already
        const servicesArray = Array.isArray(services) ? services : [services];
        const categoryArray = Array.isArray(category) ? category : [category];
  
        // Create new tour object
        const newTour = new tourModel({
          name,
          numberOfPersons,
          imageUrl: imageFile.path,
          pdf: pdfFile.path,
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
        console.error('Error creating tour:', error);
        if (error.response && error.response.body) {
          console.error('Cloudinary error:', error.response.body);
        }
        res.status(500).json({
          success: false,
          error: 'An error occurred while creating the tour.'
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