const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    tag: {type: String},
    name: {type: String, required: true},
    description: {type: String},
    category: {type: String},
    price: {type: Number, required: true},
    rating: {type: Number},
    imageName: {type: String}
})

module.exports = mongoose.model("products", productSchema)

// "productSchema som jag exports, skapas på MongoDB"