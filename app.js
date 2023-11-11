require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const indexRouter = require("./routes/index")

const app = express()

// Connect to database
const mongoDB = process.env.MONGODB_URI
mongoose.set("strictQuery", false)
mongoose.connect(mongoDB).catch((err) => console.error(err))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

app.set("views", "./views")
app.set("view engine", "pug")

app.use("/", indexRouter)

app.listen(3000)
