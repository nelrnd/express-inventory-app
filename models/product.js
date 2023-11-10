const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ProductSchema = new Schema({
  name: { type: String, required: true, minLength: 3 },
  description: { type: String, required: true, minLength: 10 },
  price: { type: Number, required: true, min: 1 },
  number_in_stock: { type: Number, required: true, min: 0 },
  image_url: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
})

ProductSchema.virtual("url").get(function () {
  return `/product/${this._id}`
})

ProductSchema.virtual("formated_price").get(function () {
  return (
    "$" +
    this.price
      .toString()
      .split("")
      .reverse()
      .map((d, id, arr) =>
        (id + 1) % 3 || id === arr.length - 1 ? d : "," + d
      )
      .reverse()
      .join("")
  )
})

module.exports = mongoose.model("Product", ProductSchema)
