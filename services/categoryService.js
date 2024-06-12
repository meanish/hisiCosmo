const CategoryRepository = require("../repositories/categoryRepository")
const Category = require("../models/categoryModel")
const slugify = require('slugify');
const sequelize = require("../database/conn");
const MediaRepository = require("../repositories/mediaRepository");
const categoryRepository = require("../repositories/categoryRepository");



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
        return { ...category.dataValues, featured_image: `${featured_image}` };

    } catch (error) {
        return { success: false, message: error.message };
    }


}



const getallCat = async () => {

    try {
        const categories = await CategoryRepository.all();
        console.log("Categoris all", categories)

        // const buildCategoryTree = (categories, parentId = null) => {
        //     const categoryTree = categories
        //         .filter(category => category.parent_category_id === parentId)
        //         .map(category => {
        //             const subcategories = buildCategoryTree(categories, category.id);
        //             return {
        //                 ...category.dataValues,
        //                 subcategories: subcategories.length ? subcategories : null,
        //             };
        //         });
        //     return categoryTree;
        // };

        // Build the category tree starting from the root (parent_category_id === null)
        // const categoryTree = buildCategoryTree(category);

        const buildCategoryTree = (categories) => {
            const categoryTree = categories
                .filter(category => category.parent_category_id === null)
                .map(category => {
                    const subCategories = categories.filter(sub => sub.parent_category_id === category.id)
                    return {
                        ...category.dataValues,
                        subcategories: subCategories.map(sub => sub.dataValues),
                    };
                });

            return categoryTree;
        };

        // Build the category tree starting from the root (parent_category_id === null)
        const categoryTree = buildCategoryTree(categories);
        return categoryTree;

    } catch (error) {
        return { success: false, message: "Category failed" };
    }


}


const editSingleCat = async ({ fields, id, file }) => {
    const transaction = await sequelize.transaction();
    const { parent_category_id, name, description } = fields;
    let featured_image_file
    let slug

    // try {
    //     const category = await CategoryRepository.update(id, parent_category_id, name);
    //     return category;

    // } catch (error) {
    //     return { success: false, message: "Category failed" };
    // }


    try {

        if (file) {
            // If there's a new file, update the featured_image in the Media table
            const mediaData = {
                mediaableId: id,
                mediaableType: 'category',
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
            const existingMedia = await MediaRepository.find({ mediaableId: id, mediaableType: 'category' });
            if (existingMedia) {
                featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${existingMedia.filePath}`;
            }
            else {
                featured_image = "";

            }
        }

        const updatedCategory = await categoryRepository.update({ id, parent_category_id, name, description }, { transaction });
        await transaction.commit();

        return { ...updatedCategory.dataValues, featured_image: `${featured_image}` };

    } catch (error) {
        return { success: false, message: "Category failed" };
    }

}


const getSingleCat = async (id) => {
    try {
        const categories = await CategoryRepository.all();

        const findCategoryData = (id) => {
            const category = categories.find(cat => cat.dataValues.id === +id);

            if (!category) {
                return null;
            }

            const parentCategoryData = category.dataValues.parent_category_id
                ? findCategoryData(category.dataValues.parent_category_id)
                : null;

            return {
                ...category.dataValues,
                parentData: parentCategoryData,
            };
        };

        // Assuming `id` is defined somewhere in your code as the root category id
        const categoryData = findCategoryData(id);

        return categoryData;

    } catch (error) {
        return { success: false, message: error.message };
    }
}


const deleteSingleCat = async (data) => {
    console.log("whats to delete", data)
    return data
}





module.exports = {
    createNew,
    getallCat,
    editSingleCat,
    getSingleCat,
    deleteSingleCat

};