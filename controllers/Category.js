const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, description) are required",
      });
    }

    const img = req.files?.img;
    if (!img) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    const uploadResult = await uploadImageToCloudinary(img, "THE_DIGITAL_DINNER");

    const newCategory = new Category({
      name,
      description,
      image: uploadResult.secure_url, 
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });

  } catch (error) {
    console.error("❌ Error in addCategory:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id || !name || !description) {
      return res.status(400).json({ success: false, message: "ID, name and description are required" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    let imageUrl = category.image;
    const img = req.files?.img;
    if (img) {
      const uploadResult = await uploadImageToCloudinary(img, "THE_DIGITAL_DINNER");
      imageUrl = uploadResult.secure_url;
    }

    category.name = name;
    category.description = description;
    category.image = imageUrl;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


exports.getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find({});
      return res.status(200).json({
        success: true,
        message: "All categories fetched successfully",
        categories,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  };