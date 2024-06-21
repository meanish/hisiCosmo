const fs = require('fs')

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
        try {
            return await Media.findOne({ where: { mediaableId: mediaableId, mediaableType: mediaableType } });
        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    },

    update: async (mediaData, options) => {
        console.log("is updating", mediaData)
        try {
            return await Media.update(mediaData, {
                where: {
                    mediaableId: mediaData.mediaableId,
                    mediaableType: mediaData.mediaableType
                },
                ...options
            });

        } catch (error) {
            throw new Error(error.message);
        }
    },

    delete: async (mediaData, purpose, options) => {
        try {
            const relatedMedia = await Media.findAll({
                where: {
                    mediaableId: mediaData.mediaableId,
                    mediaableType: mediaData.mediaableType,
                },
                ...options
            });


            for (const media of relatedMedia) {
                const filePath = media?.dataValues?.filePath
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error removing file: ${err}`);
                        return;
                    }
                });

            }

            if (purpose?.purpose != "edit") {
                await Media.destroy({
                    where: {
                        mediaableId: mediaData.mediaableId,
                        mediaableType: mediaData.mediaableType
                    },
                    ...options
                });
            }



        } catch (err) {
            throw new Error(err);

        }
    }
}







