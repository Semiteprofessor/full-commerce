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

const getAllSubCategories = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = "", category } = req.query;
    const currentCategory = category
      ? await Category.findOne({ slug: category })
      : null;
    if (category && !currentCategory) {
      res.status(404).json({ message: "Category not found!" });
    }
    const skip = parseInt(limit) || 10;
    const query = {
      name: { $regex: search, $options: "i" },
      ...(currentCategory && { parentCategory: currentCategory._id }),
    };

    const totalSubCategories = await SubCategories.find(query);

    const subcategories = await SubCategories.find(query, null, {
      skip: skip * (parseInt(page) - 1 || 0),
      limit: skip,
    }).sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      data: subcategories,
      count: Math.ceil(totalSubCategories.length / skip),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createSubCategory };
