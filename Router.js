const express= require("express")
const router= express.Router()
const { getAllCar , updateCar,createCar, deleteCar,getCarsByCategory, Register, Login} = require("./Controller/carController");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const CarModel = require("./Model/carModel");
const cabModel = require('./Model/AllcabsModel')
const { sendMail } = require('./nodemailer');
// const { getHoliday, createHoliday } = require("./Controller/holidayController");
// const { getAllTour, createTour, updateTour } = require("./Controller/tourController");
const {getfilteredCabs}= require("./Controller/AllCabsController")
const { getHoliday, createHoliday, updateHoliday, deleteHoliday } = require("./Controller/holidayController");
const { getAllTour, createTour, updateTour, deleteTour } = require("./Controller/tourController");
const upload=require ('./utlis/uploadImage.js');



 

router.route("/allFilteredCabs").get(getfilteredCabs)
router.route("/allCars").get(getAllCar)
router.route("/avaibleCars").get(getCarsByCategory)
router.post("/createCar",upload.any(), createCar);

// router.route("/createCar").post(createCar);
router.route("/update/:id").put(updateCar);
router.route("/delete/:id").delete(deleteCar)
router.route('/sendemail').post(sendMail);
router.route('/register').post(Register);
router.route('/login').post(Login)


///route foor getHolidayPackages
router.route('/holiday').get(getHoliday);
router.post('/createHoliday',upload.any(),createHoliday)
router.route('/updateHoliday/:id').put(updateHoliday);
router.route('/deleteHoliday/:id').delete(deleteHoliday);
///route foor getTourPackage'
router.route('/tour').get(getAllTour);
router.post('/createTour' ,upload.any(),createTour);
router.route('/updateTour/:id').put(updateTour);
router.route('/deleteTour/:id').delete(deleteTour);

module.exports=router


// MONGO_URL=mongodb+srv://nsathiyakala6:Mh64rjBCXQjSCyzL@cluster0.mgdlssf.mongodb.net/SaranamAyyappaTravels?retryWrites=true&w=majority&appName=Cluster0
