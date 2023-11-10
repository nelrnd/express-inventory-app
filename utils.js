exports.formatPrice = function (price) {
  return (
    "$" +
    price
      .toString()
      .split("")
      .reverse()
      .map((d, id, arr) => ((id + 1) % 3 || id === arr.length - 1 ? d : "," + d))
      .reverse()
      .join("")
  )
}
