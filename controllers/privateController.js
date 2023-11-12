const asyncHandler = require("express-async-handler")
const { query, validationResult } = require("express-validator")

exports.protected_route = [
  query("password")
    .custom((value) => {
      const isValid =
        value === undefined || value === process.env.ADMIN_PASSWORD
      return isValid ? Promise.resolve() : Promise.reject()
    })
    .withMessage("Invalid password"),
  asyncHandler(async (req, res, next) => {
    if (req.query.password === process.env.ADMIN_PASSWORD) {
      req.query.password = ""
      return next()
    } else {
      const errors = validationResult(req)

      res.render("private_form", {
        title: "Enter password",
        errors: errors.array(),
      })
    }
  }),
]
