const mediaRepository = require("../repositories/mediaRepository");
const imageConvert = require("./imageSlashremoval");


const mediaTask = async (id, file, mediaType, fields, options) => {


    console.log("I media up;oad id is", id)
    let featured_image_path
    const { featured_image } = fields
    let featured_image_file




    console.log("Media upload for featured image", featured_image, "file", file, "fields", fields, "id", id, "mediaType", mediaType)


    if (file) {
        // If there's a new file, update the featured_image in the Media table
        const mediaData = {
            mediaableId: id,
            mediaableType: mediaType,
            filePath: file.path,
            fileType: file.mimetype
        };
        // Find the existing featured_image
        const existingMedia = await mediaRepository.find(mediaData);


        console.log("Is existing in dB already", existingMedia)


        if (existingMedia) {
            // Delete stored image first
            await mediaRepository.delete(mediaData, { purpose: "edit" }, { options });
            // Update existing media
            isUpdated = await mediaRepository.update(mediaData, { options });
            console.log("What is updated", isUpdated)
            if (isUpdated) {
                featured_image_file = await mediaRepository.find(mediaData,
                    { options }
                )
            }
        } else {
            // Create new media if it doesn't exist
            featured_image_file = await mediaRepository.create(mediaData, { options });

        }

        let imgPath = featured_image_file ? imageConvert(featured_image_file.filePath) : null
        featured_image_path = imgPath ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${imgPath}` : "";


    } else if (featured_image === null) {
        console.log("NUll in image")
        // If featured_image is explicitly set to null, delete the media entry
        const existingMedia = await mediaRepository.find({
            mediaableId: id,
            mediaableType: mediaType
        });

        if (existingMedia) {
            // Delete the media entry
            await mediaRepository.delete({
                mediaableId: id,
                mediaableType: mediaType
            }, { options });

            featured_image_path = "";
        }
    }
    else {
        // If there's no new file, get the existing featured_image if it exists
        const existingMedia = await mediaRepository.find({
            mediaableId: id,
            mediaableType: mediaType
        });
        console.log("Did setr image now find one", existingMedia)
        if (existingMedia) {
            let imgPath = imageConvert(existingMedia.filePath)
            featured_image_path = imgPath ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${imgPath}` : "";

        }
        else {
            featured_image_path = "";
        }
    }
    // If there's a new file, update the featured_image in the Media table
    // if (file) {
    //     const mediaData = {
    //         mediaableId: id,
    //         mediaableType: mediaType,
    //         filePath: file.path,
    //         fileType: file.mimetype
    //     };
    //     // Find the existing featured_image
    //     const existingMedia = await mediaRepository.find(mediaData);



    //     if (existingMedia) {
    //         await mediaRepository.delete(mediaData, { purpose: "edit" }, { options });

    //         // Update existing media
    //         featured_image_file = await mediaRepository.update(mediaData, { options });
    //     } else {
    //         // Create new media if it doesn't exist
    //         featured_image_file = await mediaRepository.create(mediaData, { options });

    //     }

    //     featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath} `;
    // }


    // else {
    //     // If there's no new file, get the existing featured_image if it exists
    //     const existingMedia = await mediaRepository.find({ mediaableId: id, mediaableType: mediaType });
    //     if (existingMedia) {
    //         featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${existingMedia.filePath}`;
    //     }
    //     else {
    //         featured_image = "";

    //     }
    // }

    return featured_image_path;
}

module.exports = mediaTask