const Product = require("../models/product")
const Category = require("../models/category")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

exports.product_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .exec()

  res.render("product_detail", { title: product.name, product: product })
})

exports.product_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name")
    .collation({ locale: "en", strength: 2 })
    .sort({ name: 1 })
    .exec()

  res.render("product_form", {
    title: "Create new product",
    category_list: allCategories,
  })
})

exports.product_create_post = [
  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must be specified.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters.")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("If specified, description must be longer than 10 characters")
    .escape(),
  body("image_url")
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL")
    .optional({ values: "falsy" }),
  // Handle the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
      image_url: req.body.image_url,
    })

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, "name")
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 })
        .exec()

      res.render("product_form", {
        title: "Create new product",
        product: product,
        category_list: allCategories,
        errors: errors.array(),
      })
      return
    }

    await product.save()
    res.redirect(product.url)
  }),
]

exports.product_update_get = asyncHandler(async (req, res, next) => {
  const [product, allCategories] = await Promise.all([
    Product.findById(req.params.id).exec(),
    Category.find({}, "name")
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 })
      .exec(),
  ])

  if (product === null) {
    const err = new Error("Product not found")
    err.status = 404
    return next(err)
  }

  res.render("product_form", {
    title: `Update product: ${product.name}`,
    product: product,
    category_list: allCategories,
  })
})

exports.product_update_post = [
  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must be specified.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters.")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("If specified, description must be longer than 10 characters")
    .escape(),
  body("image_url")
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL")
    .optional({ values: "falsy" }),
  // Handle the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const product = new Product({
      _id: req.params.id,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      number_in_stock: req.body.number_in_stock,
      image_url: req.body.image_url,
      category: req.body.category,
    })

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, "name")
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 })
        .exec()

      res.render("product_form", {
        title: `Update product: ${product.name}`,
        product: product,
        category_list: allCategories,
        errors: errors.array(),
      })
      return
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      product
    )
    res.redirect(updatedProduct.url)
  }),
]

exports.product_delete_get = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (product === null) {
    res.redirect("/")
  }

  res.render("product_delete", {
    title: `Delete product: ${product.name}`,
    product: product,
  })
})

exports.product_delete_post = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id, "category")
    .populate("category")
    .exec()
  const categoryUrl = product.category.url
  await Product.findByIdAndDelete(req.params.id)
  res.redirect(categoryUrl)
})
