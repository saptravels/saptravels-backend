const cabModel = require("../Model/AllcabsModel");

exports.getfilteredCabs = async (req, res) => {
    try {
        const { category, distance, localTripType } = req.query;
        const distanceInKm = parseInt(distance, 10);

        // Distance Key for Drop Trip and Outstation
        let distanceKey = "";
        if (distanceInKm >= 0 && distanceInKm <= 25) {
            distanceKey = "0-25";
        } else if (distanceInKm > 25 && distanceInKm <= 50) {
            distanceKey = "26-50";
        } else if (distanceInKm > 50 && distanceInKm <= 75) {
            distanceKey = "51-75";
        } else if (distanceInKm > 75 && distanceInKm <= 100) {
            distanceKey = "76-100";
        } else if (distanceInKm > 100 && distanceInKm <= 150) {
            distanceKey = "101-150";
        } else if (distanceInKm > 150 && distanceInKm <= 200) {
            distanceKey = "151-200";
        } else if (distanceInKm > 200 && distanceInKm <= 250) {
            distanceKey = "201-250";
        } else if (distanceInKm > 300) {
            distanceKey = ">300";
        }

        // Outstation Distance Key
        let OSDistanceKey = "";
        if (distanceInKm >= 0 && distanceInKm <= 400) {
            OSDistanceKey = "0-400";
        } else if (distanceInKm > 400) {
            OSDistanceKey = ">400";
        }

        const filterConditions = { category };

        // Drop Trip: Ensure price for the selected distance range exists
        if (category === "Drop Trip") {
            filterConditions[`pricePerKm.${distanceKey}`] = { $exists: true };
        }

        // Local Trip: Ensure data for the selected localTripType and respective pricing exists
        if (category === "Local Trip" && localTripType) {
            if (localTripType === "Hour-Basis") {
                filterConditions[`localTripType.${localTripType}.minCharge`] = { $exists: true };
            } else {
                filterConditions[`localTripType.${localTripType}.perDayRent`] = { $exists: true };
            }
        }

        // Outstation: Ensure data for the selected distance range exists
        if (category === "Outstation") {
            filterConditions[`pricePerday.${OSDistanceKey}`] = { $exists: true };
        }

        const filteredCabs = await cabModel.find(filterConditions).lean();

        // Format the result to include only relevant fields
        const result = filteredCabs.map(cab => {
            if (category === "Drop Trip") {
                return {
                    ...cab,
                    pricePerKm: {
                        [distanceKey]: cab.pricePerKm[distanceKey]
                    }
                };
            } 
            if (category === "Local Trip" && localTripType) {
                return {
                    ...cab,
                    localTripType: {
                        [localTripType]: cab.localTripType[localTripType]
                    }
                };
            } 
            if (category === "Outstation") {
                return {
                    ...cab,
                    pricePerday: {
                        [OSDistanceKey]: cab.pricePerday[OSDistanceKey]
                    }
                };
            }
            return cab;
        });

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No cabs found matching the criteria.",
            });
        }
        res.json({
            success: true,
            filteredCabs: result
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


