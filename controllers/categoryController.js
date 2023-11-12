const Category = require("../models/category")
const Product = require("../models/product")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")
const slugify = require("slugify")
const { protected_route } = require("./privateController")

exports.category_list = asyncHandler(async (req, res, next) => {
  // Get all categories
  const allCategories = await Category.find({}, "name slug").exec()

  // Get the number of products for each category
  const productCounts = await Promise.all(
    allCategories.map((cat) => Product.countDocuments({ category: cat }).exec())
  )
  allCategories.forEach(
    (cat, id) => (cat.number_of_product = productCounts[id])
  )

  res.render("category_list", {
    title: "All categories",
    category_list: allCategories,
  })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
  // Get the category
  const category = await Category.findOne({ slug: req.params.slug }).exec()

  // Get products from that category
  const categoryProducts = await Product.find(
    { category: category },
    "name slug price photo_url"
  ).exec()

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
    .custom(async (value) => {
      const slug = slugify(value)
      if (slug.length < 3) {
        return Promise.reject()
      }
    })
    .withMessage(
      "Name must contain at least 3 alphabetical or numerical characters."
    )
    .custom(async (value) => {
      const slug = slugify(value, { lower: true })
      let slugExists = await Category.exists({ slug }).exec()
      if (slugExists) {
        return Promise.reject()
      }
    })
    .withMessage("Name must be unique but is already used by another category.")
    .escape(),
  body("description")
    .trim()
    .optional({ values: "falsy" })
    .isLength({ min: 10 })
    .withMessage("If specified, description must be at least 10 characters.")
    .escape(),
  // Handle the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const category = new Category({
      name: req.body.name,
      slug: slugify(req.body.name, { lower: true }),
      description: req.body.description,
    })

    if (!errors.isEmpty()) {
      return res.render("category_form", {
        title: "Create new category",
        category,
        errors: errors.array(),
      })
    }

    await category.save()
    res.redirect(category.url)
  }),
]

exports.category_update_get = [
  protected_route,
  asyncHandler(async (req, res, next) => {
    // Get the category
    const category = await Category.findOne({ slug: req.params.slug }).exec()

    if (category === null) {
      const err = new Error("Category not found")
      err.status = 404
      return next(err)
    }

    res.render("category_form", {
      title: `Update category: ${category.name}`,
      category,
    })
  }),
]

exports.category_update_post = [
  // Validate and sanitize fields
  body("name")
    .trim()
    .custom(async (value) => {
      const slug = slugify(value)
      if (slug.length < 3) {
        return Promise.reject()
      }
    })
    .withMessage(
      "Name must contain at least 3 alphabetical or numerical characters."
    )
    .custom(async (value, { req }) => {
      const slug = slugify(value, { lower: true })
      let slugExists = await Category.exists({
        slug,
        _id: { $ne: req.body.id },
      }).exec()
      if (slugExists) {
        return Promise.reject()
      }
    })
    .withMessage("Name must be unique but is already used by another category.")
    .escape(),
  body("description")
    .trim()
    .optional({ values: "falsy" })
    .isLength({ min: 10 })
    .withMessage("If specified, description must be at least 10 characters.")
    .escape(),
  // Handle the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const category = new Category({
      _id: req.body.id,
      name: req.body.name,
      slug: slugify(req.body.name, { lower: true }),
      description: req.body.description,
    })

    if (!errors.isEmpty()) {
      return res.render("category_form", {
        title: `Update category: ${category.name}`,
        category,
        errors: errors.array(),
      })
    }

    await Category.findByIdAndUpdate(req.body.id, category)
    res.redirect(category.url)
  }),
]

exports.category_delete_get = [
  protected_route,
  asyncHandler(async (req, res, next) => {
    // Get category and products from that category
    const category = await Category.findOne({ slug: req.params.slug }).exec()
    const categoryProducts = await Product.find(
      { category },
      "name slug"
    ).exec()

    // If category don't exist, redirect to home page
    if (category === null) {
      return res.redirect("/")
    }

    res.render("category_delete", {
      title: `Delete category: ${category.name}`,
      category,
      category_product_list: categoryProducts,
    })
  }),
]

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get category and products from that category
  const category = await Category.findById(req.body.id).exec()
  const categoryProducts = await Product.find({ category }, "name").exec()

  if (categoryProducts.length > 0) {
    res.render("category_delete", {
      title: `Delete category: ${category.name}`,
      category,
      category_product_list: categoryProducts,
    })
    return
  }

  await Category.findByIdAndDelete(req.body.id).exec()
  res.redirect("/")
})
