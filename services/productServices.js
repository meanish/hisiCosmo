const ProductRepository = require("../repositories/productRepository")
const sequelize = require("../database/conn");
const slugify = require("slugify");
const mediaRepository = require("../repositories/mediaRepository");
const { Product, Media, Category } = require("../models/association");
const mediaTask = require("../helper/mediaTask");
const productRepository = require("../repositories/productRepository");


const createNew = async (req) => {
    const transaction = await sequelize.transaction();
    const proData = req.body
    const file = req.file;


    console.log("pr", proData, file)
    try {
        if (proData.name) {
            proData.slug = slugify(proData.name, { lower: true, strict: true });
        }

        // Check if a category with the same slug already exists
        const existingProduct = await Product.findOne({ where: { slug: proData.slug } });

        if (existingProduct) {
            return { success: false, message: `A product with the slug '${proData.slug}' already exists.` }
        }

        const product = await ProductRepository.create(proData, { transaction });
        console.log("What you return in product", product)
        let featured_image = ""

        if (file) {
            const mediaData = {
                mediaableId: product.id,
                mediaableType: 'product',
                filePath: file.path,
                fileType: file.mimetype
            };

            const featured_image_file = await mediaRepository.create(mediaData, { transaction });
            featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath} `;
        }


        await transaction.commit();
        return { success: true, data: { ...product.dataValues, featured_image: `${featured_image}` } };

    } catch (error) {
        await transaction.rollback();
        console.log("What you return in product", error)
        return { success: false, message: error };
    }

}


const addCategoriesToProduct = async ({ productId, categoryIds }) => {
    const transaction = await sequelize.transaction();

    try {
        const proCatData = await ProductRepository.addCategories(productId, categoryIds, { transaction });
        await transaction.commit();
        return { success: true, data: proCatData };

    } catch (error) {
        await transaction.rollback();
        console.log('What iss wrong', error)
        return { success: false, message: error.message };
    }
}




const getallProduct = async () => {

    try {
        const products = await ProductRepository.all();
        console.log("P", products)
        return { success: true, data: products }
        // const buildCategoryTree = async (categories) => {

        //     const getCategoryWithImage = async (category) => {
        //         const mediaData = {
        //             mediaableId: category.id,
        //             mediaableType: 'category',
        //         };

        //         const featured_image_file = await MediaRepository.find(mediaData);
        //         const featured_image = featured_image_file ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath}` : "";

        //         return {
        //             ...category.dataValues,
        //             featured_image,
        //         };

        //     };

        //     const categoryTree = await Promise.all(categories
        //         .filter(category => category.parent_category_id === null)
        //         .map(async (category) => {
        //             const subCategories = await Promise.all(categories
        //                 .filter(sub => sub.parent_category_id === category.id)
        //                 .map(getCategoryWithImage)
        //             );

        //             const categoryWithImage = await getCategoryWithImage(category);
        //             return {
        //                 ...categoryWithImage,
        //                 subcategories: subCategories,
        //             };
        //         }));

        //     return categoryTree;
        // };

        // Build the category tree starting from the root (parent_category_id === null)
        // const categoryTree = await buildCategoryTree(categories);


    } catch (error) {
        return { success: false, message: "Fetch category failed" };
    }


}


const editSinglePro = async ({ fields, id, file }) => {
    const transaction = await sequelize.transaction();
    const mediaType = "product"
    let { categoryIds } = fields
    console.log("hyp[o", typeof categoryIds)
    let categories = [];

    try {


        let featured_image = await mediaTask(id, file, mediaType, { transaction })
        console.log("Image", featured_image)

        const updatedProduct = await productRepository.update(id, fields, { transaction });
        categoryIds = JSON.parse(categoryIds).map(Number);


        // Iterate over each categoryId and fetch the corresponding category
        for (const categoryId of categoryIds) {
            console.log("Delta", categoryId)
            const category = await Category.findByPk(categoryId, { transaction });

            if (!category) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }

            categories.push(category);
        }
        await updatedProduct.setCategories(categories, { transaction });
        await transaction.commit();
        return { success: true, data: { ...updatedProduct.dataValues, featured_image: featured_image } };

    } catch (error) {
        await transaction.rollback();
        console.log("Error", error)
        return { success: false, message: error.message };
    }

}


const getSingleProduct = async (id) => {
    try {
        const ProdWCatData = async (id) => {
            // Find the product by id and include related categories
            const product = await Product.findByPk(id, {
                include: [
                    {
                        model: Category,
                        as: 'categories',
                        through: { attributes: [] },
                    }
                    //     ,
                    //     {
                    //         model: Media,
                    //         as: 'productMedia',
                    //     },
                ],
            });

            if (!product) {
                return { success: false, message: `Product with ID ${id} not found` };
            }

            const mediaData = {
                mediaableId: id,
                mediaableType: 'product',
            }
            const featured_image_file = await mediaRepository.find(mediaData)
            if (featured_image_file) {
                featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.dataValues.filePath}`;
            }
            else {
                featured_image = ""
            }


            return {
                ...product.get({ plain: true }),
                featured_image: featured_image,
            };
        };

        // Assuming `id` is defined somewhere in your code as the root category id
        const productData = await ProdWCatData(id);
        return { success: true, data: productData }

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
    addCategoriesToProduct,
    getallProduct,
    getSingleProduct,
    editSinglePro

};