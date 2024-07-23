const mediaRepository = require("../repositories/mediaRepository");


const MultimediaTask = async (id, files, media, fields, options) => {

    let product_gallery_files = []
    let { mediaType } = media

    if (files && files.length > 0) {
        const existingMedia = await mediaRepository.findAll({ mediaableId: id, mediaableType: "productGallery" });
        if (existingMedia) {
            await mediaRepository.delete({ mediaableId: id, mediaableType: "productGallery" }, { options });
        }

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const mediaData = {
                mediaableId: id,
                mediaableType: mediaType,
                filePath: file.path,
                fileType: file.mimetype,
                position: index + 1
            };

            const gallery_file = await mediaRepository.create(mediaData, { options });
            product_gallery_files.push(`${process.env.NEXT_PUBLIC_HISI_SERVER}/${gallery_file.filePath}`);

        }

    }

    else {
        // If there's no new file, get the existing featured_image if it exists
        const existingMedia = await mediaRepository.findAll({ mediaableId: id, mediaableType: "productGallery" });
        if (existingMedia) {
            for (let index = 0; index < existingMedia.length; index++) {
                product_gallery_files.push(`${process.env.NEXT_PUBLIC_HISI_SERVER}/${existingMedia[index].dataValues.filePath}`);

            }
        }
        else {
            product_gallery_files = [];

        }
    }
    return product_gallery_files;
}

module.exports = MultimediaTask