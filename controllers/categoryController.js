const Category = require("../models/category")
const Product = require("../models/product")
const asyncHandler = require("express-async-handler")

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec()

  res.render("category_list", {
    title: "All categories",
    category_list: allCategories,
  })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find().exec(),
  ])

  if (category === null) {
    const err = new Error("Category not found")
    err.status = 404
    return next(err)
  }

  console.log(categoryProducts)

  res.render("category_detail", {
    title: category.name,
    category: category,
    category_product_list: categoryProducts,
  })
})

exports.category_create_get = (req, res, next) => {
  res.send("Category create GET - Not implemented yet")
}

exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send("Category create POST - Not implemented yet")
})

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("Category update GET - Not implemented yet")
})

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("Category update POST - Not implemented yet")
})

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Category delete GET - Not implemented yet")
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Category delete POST - Not implemented yet")
})
