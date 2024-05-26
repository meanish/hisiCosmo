const CategoryRepository = require("../repositories/categoryRepository")

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


const editCat = async (catSlug) => {

    try {
        const category = await CategoryRepository.update();
        return category;

    } catch (error) {
        return { success: false, message: "Category failed" };
    }


}







module.exports = {
    createNew,
    getallCat,
    editCat

};