const { Product, Media, Category } = require("../models/association");

const { Sequelize } = require('sequelize');
const ProductCategories = require("../models/productCategories");


const filterProduct = async (req, res) => {
    try {
        // const brandId = req.query.brand ? req.query.brand : null;

        const brandIds = req.query.brand ? req.query.brand.split(',') : [];

        console.log("ids", brandIds)


        // Build the filter condition
        const filter = {};

        if (brandIds.length > 0) {
            filter.brand_id = { [Sequelize.Op.in]: brandIds };
        }

        const include = [];
        if (req.query.category) {
            const categoryIds = req.query.category.split(',');

            // Find the categories and their parent categories (if they are subcategories)
            const categories = await Category.findAll({
                where: {
                    id: { [Sequelize.Op.in]: categoryIds }
                },
                attributes: ['id', 'parent_category_id']
            });

            let allCategoryIds = categoryIds.slice(); // Start with the given category IDs


            console.log("ALlcategory", allCategoryIds)


            // Add parent category IDs if they exist
            categories.forEach(cat => {
                if (cat.parent_category_id) {

                    allCategoryIds.push(cat.parent_category_id);
                }
            });

            console.log("Catgeories", categories)

            include.push({
                model: Category,
                as: 'categories', // Use the correct alias
                where: {
                    id: { [Sequelize.Op.in]: allCategoryIds }
                },
                through: {
                    model: ProductCategories, // Specifies the join table
                    attributes: [] // Exclude join table attributes
                },
                attributes: [] // Exclude category attributes if not needed
            });
        }



        if (req.query.maxPrice) {
            filter.price = {
                [Sequelize.Op.between]: [req.query.minPrice || 0, req.query.maxPrice]
            };
        }


        // Fetch products matching the filter
        const products = await Product.findAll({
            where: filter,
            include: include,
        });


        res.status(200).json({ success: "true", data: products });
    } catch (error) {
        res.status(500).json({ success: "false", error: error.message });
    }
}


module.exports = { filterProduct };
