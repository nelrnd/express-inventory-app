const mongoose = require("mongoose")
const { serializeName } = require("../utils")

const Schema = mongoose.Schema

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 3 },
  description: { type: String },
  imageURL: { type: String },
})

CategorySchema.virtual("url").get(function () {
  return `/category/${serializeName(this.name)}`
})

module.exports = mongoose.model("Category", CategorySchema)
