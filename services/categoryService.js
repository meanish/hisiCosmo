const CategoryRepository = require("../repositories/categoryRepository")
const Category = require("../models/categoryModel")
const slugify = require('slugify');
const sequelize = require("../database/conn");
const MediaRepository = require("../repositories/mediaRepository");
const categoryRepository = require("../repositories/categoryRepository");
const mediaRepository = require("../repositories/mediaRepository");
const mediaTask = require("../helper/mediaTask");



const createNew = async (req) => {
    const transaction = await sequelize.transaction();
    const catData = req.body
    const file = req.file;

    try {
        if (catData.name) {
            catData.slug = slugify(catData.name, { lower: true, strict: true });
        }

        // Check if a category with the same slug already exists
        const existingCategory = await Category.findOne({ where: { slug: catData.slug } });

        if (existingCategory) {
            return { success: false, message: `A category with the slug '${catData.slug}' already exists.` }
        }

        const category = await CategoryRepository.create(catData, { transaction });
        let featured_image = ""


        if (file) {
            const mediaData = {
                mediaableId: category.id,
                mediaableType: 'category',
                filePath: file.path,
                fileType: file.mimetype
            };

            const featured_image_file = await MediaRepository.create(mediaData, { transaction });
            featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath} `;
        }

        await transaction.commit();
        return { success: true, data: { ...category.dataValues, featured_image: `${featured_image}` } };

    } catch (error) {
        return { success: false, message: error.message };
    }


}



const getallCat = async () => {

    try {
        const categories = await CategoryRepository.all();
        const buildCategoryTree = async (categories) => {

            const getCategoryWithImage = async (category) => {
                const mediaData = {
                    mediaableId: category.id,
                    mediaableType: 'category',
                };

                const featured_image_file = await MediaRepository.find(mediaData);
                const featured_image = featured_image_file ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath}` : "";

                return {
                    ...category.dataValues,
                    featured_image,
                };

            };

            const categoryTree = await Promise.all(categories
                .filter(category => category.parent_category_id === null)
                .map(async (category) => {
                    const subCategories = await Promise.all(categories
                        .filter(sub => sub.parent_category_id === category.id)
                        .map(getCategoryWithImage)
                    );

                    const categoryWithImage = await getCategoryWithImage(category);
                    return {
                        ...categoryWithImage,
                        subcategories: subCategories,
                    };
                }));

            return categoryTree;
        };

        // Build the category tree starting from the root (parent_category_id === null)
        const categoryTree = await buildCategoryTree(categories);
        return { success: true, data: categoryTree }

    } catch (error) {
        return { success: false, message: "Fetch category failed" };
    }


}


const editSingleCat = async ({ fields, id, file }) => {
    const transaction = await sequelize.transaction();
    const { parent_category_id, name, description, featured_image } = fields;
    let mediaType = "category"

    try {

        let featured_image = await mediaTask(id, file, mediaType, fields, { transaction })
        const updatedCategory = await categoryRepository.update({ id, parent_category_id, name, description }, { transaction });
        await transaction.commit();

        return { success: true, data: { ...updatedCategory.dataValues, featured_image: featured_image } }

    } catch (error) {
        await transaction.rollback();
        return { success: false, message: error.message };
    }

}


const getSingleCat = async (id) => {
    let parentCategoryData = null;
    try {
        const categories = await CategoryRepository.all();

        const findCategoryData = async (id) => {
            const category = categories.find(cat => cat.dataValues.id === +id);
            console.log("Finding for", id, category)
            if (!category) {
                return null;
            }

            const mediaData = {
                mediaableId: id,
                mediaableType: 'category',
            }

            if (category.dataValues?.parent_category_id) {
                parentCategoryData = await findCategoryData(category.dataValues.parent_category_id)

            }

            const featured_image_file = await MediaRepository.find(mediaData);
            if (featured_image_file) {
                featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.dataValues.filePath}`;
            }
            else {
                featured_image = ""
            }


            return {
                ...category.dataValues,
                featured_image: featured_image,
                parentData: parentCategoryData,
            };
        };

        // Assuming `id` is defined somewhere in your code as the root category id
        const categoryData = await findCategoryData(id);
        return { success: true, data: categoryData }

    } catch (error) {
        return { success: false, message: error };
    }
}

// catServices
const deleteSingleCat = async (id) => {
    const transaction = await sequelize.transaction();

    const mediaData = {
        mediaableId: id,
        mediaableType: 'category',
    }

    try {
        const relatedMedia = await mediaRepository.find(mediaData);

        if (relatedMedia) {
            // Delete the related media files
            await mediaRepository.delete(mediaData, { transaction });
        }
        // Delete the brand, associated Media will be deleted due to CASCADE delete
        const result = await CategoryRepository.delete(id, transaction)
        if (result) {
            await transaction.commit();
            return { success: true, message: "Category successfully deleted" };
        } else {
            await transaction.rollback();
            return { success: false, message: "Category not found or could not be deleted" };
        }
    } catch (error) {
        await transaction.rollback();
        return { success: false, error: error };
    }
}





module.exports = {
    createNew,
    getallCat,
    editSingleCat,
    getSingleCat,
    deleteSingleCat

};