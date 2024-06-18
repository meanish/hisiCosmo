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
    },

    delete: async (mediaData, options) => {
        try {
            const relatedMedia = await Media.findAll({
                where: {
                    mediaableId: mediaData.mediaableId,
                    mediaableType: mediaData.mediaableType,
                },
                ...options
            });

            console.log("RelatedMedia", relatedMedia)

            for (const media of relatedMedia) {
                console.log("Console if fdound", media?.dataValues, "path also find", media?.dataValues?.filePath)
                const filePath = media?.dataValues?.filePath
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error removing file: ${err}`);
                        return;
                    }
                    console.log(`File ${filePath} has been successfully removed.`);
                });

            }

            await Media.destroy({
                where: {
                    mediaableId: mediaData.mediaableId,
                    mediaableType: mediaData.mediaableType
                },
                ...options
            });


        } catch (err) {
            throw new Error(err);

        }
    }
}







