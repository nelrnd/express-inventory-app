exports.serializeName = function (name) {
  return name
    .toLowerCase()
    .replace(/\//g, "")
    .split("")
    .filter((char, id, arr) => char !== " " || arr[id - 1] !== " ")
    .join("")
    .split(" ")
    .join("-")
}
