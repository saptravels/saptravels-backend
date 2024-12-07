const mongoose = require("mongoose");
const userModel = require("../Model/UserModel");
const { userLogin } = require("../seeder/adminLogin");

const mongodbConnection = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Mongoose connected to Server");

        // Check and seed user data
        const loginCount = await userModel.countDocuments({});
        if (loginCount === 0) {
            await userModel.insertMany(userLogin);
            console.log("Dashboard logins seeded successfully");
        } else {
            console.log("Dashboard logins already exist, seeding skipped");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }

    // Handle connection errors
    mongoose.connection.on("error", (err) => {
        console.error("Mongoose connection error:", err.message);
    });
};

module.exports = mongodbConnection;
