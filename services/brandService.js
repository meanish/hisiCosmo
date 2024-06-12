const CategoryRepository = require("../repositories/categoryRepository")
const slugify = require('slugify');
const sequelize = require("../database/conn");
const MediaRepository = require("../repositories/mediaRepository");
const categoryRepository = require("../repositories/categoryRepository");
const brandRepository = require("../repositories/brandRepository");
const Brand = require("../models/brandModel");



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
            featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath} `;
        }

        await transaction.commit();
        return { ...brand.dataValues, featured_image: `${featured_image}` };

    } catch (error) {
        return { success: false, message: error.message };
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
                console.log("Image".featured_image_file)
                featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath} `;

                return {
                    ...brand.dataValues,
                    featured_image: featured_image ? featured_image : "",
                };
            }));

            return brandTree;
        };

        const categoryTree = await buildBrandTree(brands);
        return { success: true, data: categoryTree };


    } catch (error) {
        return { success: false, message: "Category failed" };
    }


}


const editSingleBrand = async ({ fields, id, file }) => {
    const transaction = await sequelize.transaction();
    const { name, description } = fields;
    let featured_image_file

    try {

        if (file) {
            // If there's a new file, update the featured_image in the Media table
            const mediaData = {
                mediaableId: id,
                mediaableType: 'brand',
                filePath: file.path,
                fileType: file.mimetype
            };
            // Find the existing featured_image
            const existingMedia = await MediaRepository.find(mediaData);



            if (existingMedia) {
                // Update existing media
                featured_image_file = await MediaRepository.update(mediaData, { transaction });
            } else {
                // Create new media if it doesn't exist
                featured_image_file = await MediaRepository.create(mediaData, { transaction });

            }

            featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath} `;

        }
        else {
            // If there's no new file, get the existing featured_image if it exists
            const existingMedia = await MediaRepository.find({ mediaableId: id, mediaableType: 'brand' });
            if (existingMedia) {
                featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${existingMedia.filePath}`;
            }
            else {
                featured_image = "";
            }
        }

        const updatedBrand = await brandRepository.update({ id, name, description }, { transaction });
        await transaction.commit();

        return {
            sucess: true,
            data: {
                ...updatedBrand.dataValues, featured_image: `${featured_image}`
            }
        };

    } catch (error) {
        return { success: false, message: "Brand Edit Failed" };
    }

}


const getSingleBrand = async (id) => {
    try {
        const brands = await brandRepository.all();

        const findBrandData = (id) => {
            const isAvailable = brands.find(currBrand => currBrand.dataValues.id === +id);

            if (!isAvailable) {
                return null;
            }

            return {
                ...isAvailable.dataValues,
            };
        };

        // Assuming `id` is defined somewhere in your code as the root category id
        const BrandData = findBrandData(id);

        return BrandData;

    } catch (error) {
        return { success: false, message: error.message };
    }
}


const deleteSingleBrand = async (data) => {
    console.log("whats to delete", data)
    return data
}





module.exports = {
    createNew,
    getallBrand,
    editSingleBrand,
    getSingleBrand,
    deleteSingleBrand

};