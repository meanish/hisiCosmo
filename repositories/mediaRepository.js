

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
    },
    find: async (mediaData) => {
        const { mediaableId, mediaableType } = mediaData
        console.log("GEt", mediaData)
        try {
            const isAvailable = await Media.findOne({ where: { mediaableId: mediaableId, mediaableType: mediaableType } });
            return isAvailable

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    update: async (mediaData, options) => {

        try {
            await Media.update(mediaData, {
                where: {
                    mediaableId: mediaData.mediaableId,
                    mediaableType: mediaData.mediaableType
                },
                ...options
            });
            return await Media.findOne({
                where: {
                    mediaableId: mediaData.mediaableId,
                    mediaableType: mediaData.mediaableType
                }
            });

        } catch (error) {
            throw new Error(error.message);
        }
    }
}







