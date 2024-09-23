const AddUrlImage = ({ items }) => {

    const modifiedItemsResult = [];


    console.log("................", items)



    const imagePath = items?.forEach(item => {
        let productWithFeaturedImage = { ...item.product?.dataValues };


        if (item.product && item.product.productmedia.length > 0) {
            const featuredImage = item.product?.dataValues.productmedia[0];
            const path = featuredImage?.dataValues.file_path;
            productWithFeaturedImage.featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${path}` || null;
        }

        modifiedItemsResult.push({
            ...item.dataValues,
            product: productWithFeaturedImage
        });
    });

    return modifiedItemsResult
}

module.exports = AddUrlImage