require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")

const app = express()

// Connect to database
const mongoDB = process.env.MONGODB_URI
mongoose.set("strictQuery", false)
mongoose.connect(mongoDB).catch((err) => console.error(err))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(3000)
