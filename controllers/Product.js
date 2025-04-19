const Product = require("../models/Product");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createProduct = async (req, res) => {
    try {
      const { name, price, description, category, tags } = req.body;
  
      if (!name || !price || !description || !category) {
        return res.status(400).json({
          success: false,
          message: "All fields (name, price, description, category) are required",
        });
      }
  
      const isCategoryExist = await Category.findById(category);
      if (!isCategoryExist) {
        return res.status(404).json({
          success: false,
          message: "Invalid category ID",
        });
      }
  
      const images = req.files?.images; 
  
      if (!images || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one product image is required",
        });
      }
  
      const uploadPromises = images.map((img) => uploadImageToCloudinary(img, "THE_DIGITAL_DINNER"));
      const uploadResults = await Promise.all(uploadPromises);
  
      const imageUrls = uploadResults.map((result) => result.secure_url);
  
      const product = await Product.create({
        name,
        price,
        description,
        category,
        tags: tags ? tags.split(",") : [],
        image: imageUrls, 
      });
  
      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  



exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId, available: true }).populate("category");
    return res.status(200).json({ success: true, message: "Products fetched successfully", products });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product fetched successfully", product });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
