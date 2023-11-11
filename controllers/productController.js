const Product = require("../models/product")
const Category = require("../models/category")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")
const slugify = require("slugify")
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

exports.product_detail = asyncHandler(async (req, res, next) => {
  // Get the product
  const product = await Product.findOne({ slug: req.params.slug })
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
  // Save photo
  upload.single("photo"),
  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name is required and must must at least 3 characters.")
    .custom(async (value) => {
      const slug = slugify(value)
      if (slug.length < 3) {
        return Promise.reject()
      }
    })
    .withMessage("Name must contain at least 3 alphabetical characters.")
    .custom(async (value) => {
      const slug = slugify(value, { lower: true })
      let slugExists = await Product.exists({ slug }).exec()
      if (slugExists) {
        return Promise.reject()
      }
    })
    .withMessage("Name must be unique but is already used by another product.")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters")
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
      slug: slugify(req.body.name, { lower: true }),
      price: req.body.price,
      description: req.body.description,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
      image_url: req.file ? "/" + req.file.path : "",
    })

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, "name")
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 })
        .exec()

      return res.render("product_form", {
        title: "Create new product",
        product,
        category_list: allCategories,
        errors: errors.array(),
      })
    }

    await product.save()
    res.redirect(product.url)
  }),
]

exports.product_update_get = asyncHandler(async (req, res, next) => {
  const [product, allCategories] = await Promise.all([
    Product.findOne({ slug: req.params.slug }).exec(),
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
    product,
    category_list: allCategories,
  })
})

exports.product_update_post = [
  // Save photo
  upload.single("photo"),
  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name is required and must must at least 3 characters.")
    .custom(async (value) => {
      const slug = slugify(value)
      if (slug.length < 3) {
        return Promise.reject()
      }
    })
    .withMessage("Name must contain at least 3 alphabetical characters.")
    .custom(async (value, { req }) => {
      const slug = slugify(value, { lower: true })
      let slugExists = await Product.exists({
        slug,
        _id: { $ne: req.body.id },
      }).exec()
      if (slugExists) {
        return Promise.reject()
      }
    })
    .withMessage("Name must be unique but is already used by another product.")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters")
    .escape(),
  body("image_url")
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL")
    .optional({ values: "falsy" }),
  // Handle the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    console.log(req.body)

    const product = new Product({
      _id: req.body.id,
      name: req.body.name,
      slug: slugify(req.body.name, { lower: true }),
      price: req.body.price,
      description: req.body.description,
      number_in_stock: req.body.number_in_stock,
      image_url: req.file ? "/" + req.file.path : "",
      category: req.body.category,
    })

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, "name")
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 })
        .exec()

      res.render("product_form", {
        title: `Update product: ${product.name}`,
        product,
        category_list: allCategories,
        errors: errors.array(),
      })
    }

    await Product.findByIdAndUpdate(req.body.id, product)
    res.redirect(product.url)
  }),
]

exports.product_delete_get = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug }).exec()

  if (product === null) {
    res.redirect("/")
  }

  res.render("product_delete", {
    title: `Delete product: ${product.name}`,
    product,
  })
})

exports.product_delete_post = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.body.id, "category")
    .populate("category")
    .exec()
  const categoryUrl = product.category.url
  await Product.findByIdAndDelete(req.body.id)
  res.redirect(categoryUrl)
})
