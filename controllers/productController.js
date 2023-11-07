const Product = require("../models/product")
const asyncHandler = require("express-async-handler")

exports.product_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec()

  res.render("product_detail", { title: product.name, product: product })
})

exports.product_create_get = asyncHandler(async (req, res, next) => {
  res.send("Product create GET - Not implemented yet")
})

exports.product_create_post = asyncHandler(async (req, res, next) => {
  res.send("Product create POST - Not implemented yet")
})

exports.product_update_get = asyncHandler(async (req, res, next) => {
  res.send("Product update GET - Not implemented yet")
})

exports.product_update_post = asyncHandler(async (req, res, next) => {
  res.send("Product update POST - Not implemented yet")
})

exports.product_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Product delete GET - Not implemented yet")
})

exports.product_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Product delete POST - Not implemented yet")
})
