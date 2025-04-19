const express = require("express");
const { addCategory, editCategory, getAllCategories } = require("../controllers/Category");
const router = express.Router();

router.post("/addcategory", addCategory);
router.post("/editcategory/:id", editCategory);
router.get("/getallcategory", getAllCategories)

module.exports = router;
