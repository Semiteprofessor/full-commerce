const SubCategories = require("../models/SubCategory");
const Category = require("../models/Category");
const getBlurDataURL = require("../config/getBlurDataUrl");
const { singleFileDelete } = require("../config/uploader");
const createSubCategory = async (req, res) => {
  try {
    const { cover, ...others } = req.body;
    // Validate if the 'blurDataURL' property exists in the logo object

    // If blurDataURL is not provided, generate it using the 'getBlurDataURL' function
    const blurDataURL = await getBlurDataURL(cover.url);

    const category = await SubCategories.create({
      ...others,
      cover: {
        ...cover,
        blurDataURL,
      },
    });
    await Category.findByIdAndUpdate(others.parentCategory, {
      $addToSet: {
        subCategories: category._id,
      },
    });

    res.status(201).json({ success: true, message: "SubCategory Created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createSubCategory };
