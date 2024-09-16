const CategoryRepository = require("../repositories/categoryRepository")
const slugify = require('slugify');
const sequelize = require("../database/conn");
const MediaRepository = require("../repositories/mediaRepository");
const categoryRepository = require("../repositories/categoryRepository");
const brandRepository = require("../repositories/brandRepository");
const Brand = require("../models/brandModel");
const mediaRepository = require("../repositories/mediaRepository");
const mediaTask = require("../helper/mediaTask");
const imageConvert = require("../helper/imageSlashremoval");



const createNew = async (req) => {
    const transaction = await sequelize.transaction();
    const brandData = req.body
    const file = req.file;

    try {
        if (brandData.name) {
            brandData.slug = slugify(brandData.name, { lower: true, strict: true });
        }

        // Check if a category with the same slug already exists
        const existingCategory = await Brand.findOne({ where: { slug: brandData.slug } });

        if (existingCategory) {
            return { success: false, message: `A brand with the slug '${brandData.slug}' already exists.` }
        }

        const brand = await brandRepository.create(brandData, { transaction });
        let featured_image = ""


        if (file) {
            const mediaData = {
                mediaableId: brand.id,
                mediaableType: 'brand',
                filePath: file.path,
                fileType: file.mimetype
            };

            const featured_image_file = await MediaRepository.create(mediaData, { transaction });

            let imgPath = featured_image_file ? imageConvert(featured_image_file.filePath) : null
            featured_image = imgPath ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${imgPath}` : "";


        }

        await transaction.commit();
        return { success: true, data: { ...brand.dataValues, featured_image: `${featured_image}` } };

    } catch (error) {
        return {
            success: false, message: "Couldn't create a brand"
        };
    }


}



const getallBrand = async () => {
    let featured_image;

    try {
        const brands = await brandRepository.all();


        const buildBrandTree = async (brands) => {
            const brandTree = await Promise.all(brands.map(async (brand) => {
                const mediaData = {
                    mediaableId: brand.id,
                    mediaableType: 'brand',
                }


                const featured_image_file = await MediaRepository.find(mediaData);
                console.log("Image", featured_image_file)

                let imgPath = featured_image_file ? imageConvert(featured_image_file.dataValues.filePath) : null
                featured_image = imgPath ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${imgPath}` : "";


                return {
                    ...brand.dataValues,
                    featured_image: featured_image,
                };
            }));

            return brandTree;
        };

        const categoryTree = await buildBrandTree(brands);
        return { success: true, data: categoryTree };


    } catch (error) {
        return { success: false, message: error.message };
    }


}


const editSingleBrand = async ({ fields, id, file }) => {
    const transaction = await sequelize.transaction();
    const { name, description, featured_image } = fields;
    let mediaType = "brand"
    try {

        let featured_image_path = await mediaTask(id, file, mediaType, fields, { transaction })



        const updatedBrand = await brandRepository.update({ id, name, description }, { transaction });
        await transaction.commit();

        return {
            success: true,
            data: {
                ...updatedBrand.dataValues, featured_image: `${featured_image_path}`
            }
        };

    } catch (error) {
        return { success: false, message: error.message };
    }

}


const getSingleBrand = async (id) => {
    const mediaData = {
        mediaableId: id,
        mediaableType: 'brand',
    }
    let featured_image;
    try {
        const brands = await brandRepository.all();

        const findBrandData = async (id) => {
            const isAvailable = brands.find(currBrand => currBrand.dataValues.id === +id);

            if (!isAvailable) {
                return null;
            }


            const featured_image_file = await MediaRepository.find(mediaData);

            if (featured_image_file) {

                let imgPath = featured_image_file ? imageConvert(featured_image_file.dataValues.filePath) : null
                featured_image = imgPath ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${imgPath}` : "";
            }
            else {
                featured_image = ""
            }
            return {
                ...isAvailable.dataValues,
                featured_image: featured_image,
            };
        };

        const BrandData = await findBrandData(id);

        return { success: true, data: BrandData };

    } catch (error) {
        return { success: false, message: error };
    }
}


const deleteSingleBrand = async (id) => {
    const transaction = await sequelize.transaction();

    const mediaData = {
        mediaableId: id,
        mediaableType: 'brand',
    }

    try {
        const relatedMedia = await mediaRepository.find(mediaData);

        if (relatedMedia) {
            // Delete the related media files

            await mediaRepository.delete(mediaData, { transaction });
        }
        // Delete the brand, associated Media will be deleted due to CASCADE delete
        const result = brandRepository.delete(id, transaction)

        if (result) {
            await transaction.commit();
            return { success: true, message: "Brand successfully deleted" };
        }
        else {
            await transaction.rollback();
            return { success: false, message: "Brand not found or could not be deleted" };
        }
    } catch (error) {
        await transaction.rollback();
        return { success: false, message: error };
    }

};





module.exports = {
    createNew,
    getallBrand,
    editSingleBrand,
    getSingleBrand,
    deleteSingleBrand

};