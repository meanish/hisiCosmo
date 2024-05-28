const CategoryRepository = require("../repositories/categoryRepository")
const Category = require("../models/categoryModel")
const slugify = require('slugify');



const createNew = async (catData) => {
    console.log("From frontend", catData)
    try {
        if (catData.name) {
            catData.slug = slugify(catData.name, { lower: true, strict: true });
        }

        // Check if a category with the same slug already exists
        const existingCategory = await Category.findOne({ where: { slug: catData.slug } });

        if (existingCategory) {
            throw new Error(`A category with the slug '${catData.slug}' already exists.`);
        }

        const category = await CategoryRepository.create(catData);
        return category;

    } catch (error) {
        return { success: false, message: error.message };
    }


}



const getallCat = async () => {

    try {
        const category = await CategoryRepository.all();


        const buildCategoryTree = (categories, parentId = null) => {
            const categoryTree = categories
                .filter(category => category.parent_category_id === parentId)
                .map(category => {
                    const subcategories = buildCategoryTree(categories, category.id);
                    return {
                        ...category.dataValues,
                        subcategories: subcategories.length ? subcategories : null,
                    };
                });
            return categoryTree;
        };

        // Build the category tree starting from the root (parent_category_id === null)
        const categoryTree = buildCategoryTree(category);

        return categoryTree;

    } catch (error) {
        return { success: false, message: "Category failed" };
    }


}


const editSingleCat = async ({ data, id }) => {
    const { parent_category_id, name } = data;

    try {
        const category = await CategoryRepository.update(id, parent_category_id, name);
        return category;

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