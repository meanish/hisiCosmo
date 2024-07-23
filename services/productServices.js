const ProductRepository = require("../repositories/productRepository")
const sequelize = require("../database/conn");
const slugify = require("slugify");
const mediaRepository = require("../repositories/mediaRepository");
const { Product, Media, Category } = require("../models/association");
const mediaTask = require("../helper/mediaTask");
const productRepository = require("../repositories/productRepository");
const MultimediaTask = require("../helper/nultiMediaUpload");


const createNew = async (req) => {
    const transaction = await sequelize.transaction();
    const proData = req.body
    const featuredImage = req.files['featured_image'] ? req.files['featured_image'][0] : null;
    const productGallery = req.files['product_gallery'] || [];
    let featured_image
    const fields = req.body
    const { categoryIds } = fields
    const mediaType = "product"


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


        if (featuredImage) {
            featured_image = await mediaTask(product.id, featuredImage, mediaType, fields, { transaction })
        }


        if (productGallery.length > 0) {
            updatedGallery = await MultimediaTask(product.id, productGallery, { mediaType: "productGallery" }, fields, { transaction })
        }

        // adding the category in the productCategories Field
        if (categoryIds && categoryIds.length > 0) {

            isCatSet = await addCategoriesToProduct({ productId: product?.id, categoryIds });
            if (!isCatSet.success) {
                return res.status(500).json({ success: false, message: isConnected.message });
            }
        }

        await transaction.commit();
        return { success: true, data: { ...product.dataValues, featured_image: featured_image, product_gallery: updatedGallery } };

    } catch (error) {
        await transaction.rollback();
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
        return { success: false, message: error.message };
    }
}




const getallProduct = async () => {

    try {
        const products = await ProductRepository.all();
        console.log("P", products)

        const buildProductTree = async (products) => {
            const getProductWithImage = async (product) => {
                const mediaData = {
                    mediaableId: product.id,
                    mediaableType: 'product',
                };

                const featured_image_file = await mediaRepository.find(mediaData);
                const featured_image = featured_image_file ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${featured_image_file.filePath}` : "";

                return {
                    ...product.dataValues,
                    featured_image,
                };
            };

            // Map each product to its corresponding product with image
            const productsWithImagesPromises = products.map(async (product) => {
                return await getProductWithImage(product);
            });

            // Wait for all promises to resolve
            const productsWithImages = await Promise.all(productsWithImagesPromises);

            return productsWithImages;
        };




        // Build the category tree starting from the root (parent_category_id === null)
        const productTree = await buildProductTree(products);
        return { success: true, data: productTree }


    } catch (error) {
        return { success: false, message: "Fetch category failed" };
    }
}


const editSinglePro = async ({ fields, id, featuredImage, productGallery }) => {
    const transaction = await sequelize.transaction();
    const mediaType = "product"
    let { categoryIds } = fields
    let categories = [];
    let featured_image
    let product_gallery = []


    try {

        if (featuredImage) {
            featured_image = await mediaTask(id, featuredImage, mediaType, fields, { transaction })
            console.log("Image", featured_image)
        }


        if (productGallery) {
            productGallery = await MultimediaTask(id, productGallery, { mediaType: "productGallery" }, fields, { transaction })
            console.log("Images of gallary", productGallery)
        }

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
        return { success: true, data: { ...updatedProduct.dataValues, featured_image: featured_image, product_gallery: productGallery } };

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


            let gallery_image_path = []

            const product_gallery_files = await mediaRepository.findAll({
                mediaableId: id,
                mediaableType: 'productGallery',
            })

            if (product_gallery_files && product_gallery_files.length > 0) {
                gallery_image_path = product_gallery_files.map(file => `${process.env.NEXT_PUBLIC_HISI_SERVER}/${file.filePath}`);

            }
            console.log("What are the gallaery images", product_gallery_files)

            return {
                ...product.get({ plain: true }),
                featured_image: featured_image,
                product_gallery: gallery_image_path
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