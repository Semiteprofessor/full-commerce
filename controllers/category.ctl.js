const slugify = require("slugify");
// const User = require("../models/User");
const Categories = require("../models/Category");
const SubCategories = require("../models/SubCategory");
// const { singleFileDelete } = require("../config/uploader");
const getBlurDataURL = require("../config/getBlurDataUrl");

const createCategory = async (req, res) => {
  try {
    const { cover, name, ...others } = req.body;

    if (!cover || !cover.url) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Cover Data" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const blurDataURL = await getBlurDataURL(cover.url);

    await Categories.create({
      name,
      slug,
      ...others,
      cover: {
        ...cover,
        blurDataURL,
      },
    });

    res.status(201).json({ success: true, message: "Category Created" });
  } catch (error) {
    // Handle duplicate slug error gracefully
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res
        .status(409)
        .json({ success: false, message: "Category slug already exists." });
    }

    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    await SubCategories.findOne();
    const categories = await Categories.find()
      .sort({
        createdAt: -1,
      })
      .select(["name", "slug"])
      .populate({ path: "subCategories", select: ["name", "slug"] });

    res.status(201).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createCategory, getAllCategories };
