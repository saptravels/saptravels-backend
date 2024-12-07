const multer = require('multer');
const holidayModel = require('../Model/holidayModel');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '../public/images');
console.log("holiday",dir);

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
// http://localhost:8000/api/v1/holiday


exports.getHoliday = async (req, res) => {
    try {
        const holidays = await holidayModel.find({});
        res.status(200).json({
            success: true,
            holidays
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// http://localhost:8000/api/v1/createHoliday
exports.createHoliday = [
    upload.fields([
        {name:"imageUrl", maxCount:1},
        {name:"pdf", maxCount:1}]),
    async (req, res) => {
        try {
            const { name, category, services } = req.body;
            const imageUrl = req.files?.imageUrl ? `/images/${req.files['imageUrl'][0].filename}` : null;
            const pdf = req.files?.pdf ? `/images/${req.files['pdf'][0].filename}` : null;
            
            if (!imageUrl || !pdf) {
                return res.status(400).json({
                    success: false,
                    message: 'Image or PDF not uploaded',
                });
            }

            if(!imageUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'Required fields are missing or image not uploaded'
                });
            }
            
            if(!pdf){
                return res.status(400).json({
                    success:"false",
                    message:"pdf not uploade"
                })
            }
            const newHoliday = new holidayModel({
                name,
                category: Array.isArray(category) ? category : [category],
                services: Array.isArray(services) ? services : [services],
                imageUrl,
                pdf
            });

            await newHoliday.save();

            res.status(201).json({
                success: true,
                holiday: newHoliday
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
];


exports.updateHoliday= async(req,res)=>{
    try{
        const id  = req.params.id
        const updateHoliday = await holidayModel.findByIdAndUpdate(id,{
            name:req.body.name,
            category:req.body.category,
            services:req.body.services,
            imageUrl:req.body.imageUrl,
            pdf:req.body.pdf

        },{
            new:true
        });
        if(!updateHoliday){
            res.status(400).json({success:"false",message:"updateholiday does not update"})
        }

        res.status(201).json({
            success:true,
            holiday:updateHoliday
        })
}
catch(err){
    res.status(500).json({
        success:false,
    message:err.message
    })
}

}
    
exports.deleteHoliday= async(req,res)=>{
    try {
        const id = req.params.id;
        const deleteHoliday = await holidayModel.findByIdAndDelete({_id:id})
        res.status(201).json({
            success:true,
            holiday:deleteHoliday
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}