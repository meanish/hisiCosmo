const UrlinOrder = ({ items }) => {

    const modifiedItemsResult = []
    const imagePath = items?.forEach(item => {
        let productWithFeaturedImage = { ...item.product?.dataValues };

        if (item.product && productWithFeaturedImage?.productmedia[0]) {
            const path = productWithFeaturedImage?.productmedia[0].dataValues?.file_path;
            productWithFeaturedImage.featured_image = `${process.env.NEXT_PUBLIC_HISI_SERVER}/${path}` || null;
        }


        return modifiedItemsResult.push({
            ...item.dataValues,
            product: productWithFeaturedImage
        });
    });


    return modifiedItemsResult

}

module.exports = UrlinOrder