const express = require("express")
const router = express.Router()

// Import controllers
const productController = require("../controllers/productController")
const categoryController = require("../controllers/categoryController")

router.get("/", categoryController.category_list)

router.get("/category/create", categoryController.category_create_get)

router.post("/category/create", categoryController.category_create_post)

router.get("/category/:slug", categoryController.category_detail)

router.get("/category/:slug/update", categoryController.category_update_get)

router.post("/category/:slug/update", categoryController.category_update_post)

router.get("/category/:slug/delete", categoryController.category_delete_get)

router.post("/category/:slug/delete", categoryController.category_delete_post)

router.get("/product/create", productController.product_create_get)

router.post("/product/create", productController.product_create_post)

router.get("/product/:slug", productController.product_detail)

router.get("/product/:slug/update", productController.product_update_get)

router.post("/product/:slug/update", productController.product_update_post)

router.get("/product/:slug/delete", productController.product_delete_get)

router.post("/product/:slug/delete", productController.product_delete_post)

module.exports = router
