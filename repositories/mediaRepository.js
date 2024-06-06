

const Media = require("../models/mediaModel")
module.exports = {
    create: async (mediaData, options) => {

        console.log("MediaData", mediaData, options)
        try {
            const imgPath = await Media.create(mediaData, options);
            return imgPath;

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    }
}







