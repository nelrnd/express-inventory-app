const Category = require("../models/category")
const Product = require("../models/product")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec()

  const promises = []

  allCategories.forEach((category) => {
    promises.push(Product.countDocuments({ category: category }).exec())
  })

  const counts = await Promise.all(promises)

  allCategories.forEach(
    (category, id) => (category.number_of_product = counts[id])
  )

  res.render("category_list", {
    title: "All categories",
    category_list: allCategories,
  })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }, "name price image_url").exec(),
  ])

  if (category === null) {
    const err = new Error("Category not found")
    err.status = 404
    return next(err)
  }

  res.render("category_detail", {
    title: category.name,
    category: category,
    category_product_list: categoryProducts,
  })
})

exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create new category" })
}

exports.category_create_post = [
  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 0 })
    .withMessage("Name must be specified.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters.")
    .escape(),
  body("description")
    .trim()
    .optional({ values: "falsy" })
    .isLength({ min: 10 })
    .withMessage("If specified, description must be longer than 10 characters")
    .escape(),
  // Handle the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    })

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create new category",
        category: category,
        errors: errors.array(),
      })
      return
    }

    await category.save()
    res.redirect(category.url)
  }),
]

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec()

  if (category === null) {
    const err = new Error("Category not found")
    err.status = 404
    return next(err)
  }

  res.render("category_form", {
    title: `Update category: ${category.name}`,
    category: category,
  })
})

exports.category_update_post = [
  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 0 })
    .withMessage("Name must be specified.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters.")
    .escape(),
  body("description")
    .trim()
    .optional({ values: "falsy" })
    .isLength({ min: 10 })
    .withMessage("If specified, description must be longer than 10 characters")
    .escape(),
  // Handle the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const category = new Category({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
    })

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: `Update category: ${category.name}`,
        category: category,
        errors: errors.array(),
      })
      return
    }

    updatedCategory = await Category.findByIdAndUpdate(req.params.id, category)
    res.redirect(updatedCategory.url)
  }),
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }, "name").exec(),
  ])

  if (category === null) {
    res.redirect("/")
    return
  }

  res.render("category_delete", {
    title: `Delete category: ${category.name}`,
    category: category,
    category_product_list: categoryProducts,
  })
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }, "name").exec(),
  ])

  if (categoryProducts.length > 0) {
    res.render("category_delete", {
      title: `Delete category: ${category.name}`,
      category: category,
      category_product_list: categoryProducts,
    })
    return
  }

  await Category.findByIdAndDelete(req.body.category_id)
  res.redirect("/")
})
