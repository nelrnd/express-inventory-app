const mongoose = require("mongoose")
const { formatPrice } = require("../utils")

const Schema = mongoose.Schema

const ProductSchema = new Schema({
  name: { type: String, required: true, minLength: 3 },
  slug: { type: String, required: true, minLength: 3 },
  description: { type: String, required: true, minLength: 10 },
  price: { type: Number, required: true, min: 1 },
  number_in_stock: { type: Number, required: true, min: 0 },
  image_url: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
})

ProductSchema.virtual("url").get(function () {
  return `/product/${this.slug}`
})

ProductSchema.virtual("formated_price").get(function () {
  return formatPrice(this.price)
})

module.exports = mongoose.model("Product", ProductSchema)
