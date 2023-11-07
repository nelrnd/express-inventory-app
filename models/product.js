const mongoose = require("mongoose")
const { serializeName } = require("../utils")

const Schema = mongoose.Schema

const ProductSchema = new Schema({
  name: { type: String, required: true, minLength: 3 },
  description: { type: String, required: true, minLength: 10 },
  price: { type: Number, required: true, min: 1 },
  number_in_stock: { type: Number, required: true, min: 0 },
  imageURL: { type: String },
  category: { type: Schema.Types.ObjectId, required: true },
})

ProductSchema.virtual("url").get(function () {
  return `/product/${serializeName(this.name)}`
})

module.exports = mongoose.model("Product", ProductSchema)