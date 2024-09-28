const { Product, Media, Category } = require("../models/association");

const { Sequelize } = require('sequelize');
const ProductCategories = require("../models/productCategories");
const imageConvert = require("../helper/imageSlashremoval");
const mediaRepository = require("../repositories/mediaRepository");


const filterProduct = async (req, res) => {
    try {
        // const brandId = req.query.brand ? req.query.brand : null;

        const brandIds = req.query.brand ? req.query.brand.split(',') : [];

        console.log("ids", brandIds)


        const filter = {};
        if (brandIds.length > 0) {
            filter.brand_id = { [Sequelize.Op.in]: brandIds };
        }

        const include = [];
        if (req.query.category) {
            const categoryIds = req.query.category.split(',');

            const categories = await Category.findAll({
                where: {
                    id: { [Sequelize.Op.in]: categoryIds }
                },
                attributes: ['id', 'parent_category_id']
            });

            let allCategoryIds = categoryIds.slice();

            console.log("ALlcategory", allCategoryIds)
            categories.forEach(cat => {
                if (cat.parent_category_id) {

                    allCategoryIds.push(cat.parent_category_id);
                }
            });

            console.log("Catgeories", categories)

            include.push({
                model: Category,
                as: 'categories',
                where: {
                    id: { [Sequelize.Op.in]: allCategoryIds }
                },
                through: {
                    model: ProductCategories,
                    attributes: [] // Excl
                },
                attributes: []
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


        // add featured images
        const PwImages = await Promise.all(products?.map(async (currPro) => {
            const mediaData = {
                mediaableId: currPro.dataValues.id,
                mediaableType: 'product',
            }

            console.log(mediaData)
            const featured_image_file = await mediaRepository.find(mediaData)

            let imgPath = featured_image_file ? imageConvert(featured_image_file.dataValues?.filePath) : null
            let featured_image = imgPath ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${imgPath}` : "";


            return { ...currPro.dataValues, featured_image: featured_image }
        }))




        res.status(200).json({ success: "true", data: PwImages });
    } catch (error) {
        res.status(500).json({ success: "false", error: error.message });
    }
}


module.exports = { filterProduct };
