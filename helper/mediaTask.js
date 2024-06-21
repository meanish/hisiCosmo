const mediaRepository = require("../repositories/mediaRepository");


const mediaTask = async (id, file, mediaType, options) => {



    // If there's a new file, update the featured_image in the Media table
    if (file) {
        const mediaData = {
            mediaableId: id,
            mediaableType: mediaType,
            filePath: file.path,
            fileType: file.mimetype
        };
        // Find the existing featured_image
        const existingMedia = await mediaRepository.find(mediaData);



        if (existingMedia) {
            await mediaRepository.delete(mediaData, { purpose: "edit" }, { options });

            // Update existing media
            featured_image_file = await mediaRepository.update(mediaData, { options });
        } else {
            // Create new media if it doesn't exist
            featured_image_file = await mediaRepository.create(mediaData, { options });

        }

        featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath} `;
    }


    else {
        // If there's no new file, get the existing featured_image if it exists
        const existingMedia = await mediaRepository.find({ mediaableId: id, mediaableType: mediaType });
        if (existingMedia) {
            featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${existingMedia.filePath}`;
        }
        else {
            featured_image = "";

        }
    }

    return featured_image;
}

module.exports = mediaTask