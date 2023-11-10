const mongoose = require("mongoose")

const Schema = mongoose.Schema

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 3 },
  slug: { type: String, required: true, minLength: 3 },
  description: { type: String },
})

CategorySchema.virtual("url").get(function () {
  return `/category/${this.slug}`
})

module.exports = mongoose.model("Category", CategorySchema)
