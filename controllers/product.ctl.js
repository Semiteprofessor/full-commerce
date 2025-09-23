const getAdmin = require("../config/getUser")
const slugify = require("slugify");

const createProductByAdmin = async (req, res) => {
  try {
    const admin = await getAdmin(req, res);
    const { images, name, ...body } = req.body;

    const slug =
      slugify(name, { lower: true, strict: true }) + "-" + Date.now();

    const updatedImages = await Promise.all(
      images.map(async (image) => {
        const blurDataURL = await blurDataUrl(image.url);
        return { ...image, blurDataURL };
      })
    );

    const data = await Product.create({
      vendor: admin._id,
      ...body,
      name,
      slug,
      images: updatedImages,
      likes: 0,
    });

    await Shop.findByIdAndUpdate(req.body.shop, {
      $addToSet: {
        products: data._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product Created",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
