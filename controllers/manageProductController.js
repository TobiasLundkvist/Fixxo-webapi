const express = require('express')
const controller = express.Router()
let users = require('../data/simulated_database')

controller.param("id", (req, res, next, id) => {
    req.user = users.find(user => user.id == id)
    next()
})



// POST - CREATE - SKAPA EN ANVÄNDARE - http://localhost:5000/api/products
controller.route('/')
.post((httpRequest, httpResponse) => {
    let user = {
        id: (users[users.length -1])?.id > 0 ? (users[users.length -1])?.id + 1 : 1,
        articleNumber: httpRequest.body.articleNumber,
        category: httpRequest.body.category,
        name: httpRequest.body.name,
        price: httpRequest.body.price,
        rating: httpRequest.body.rating, 
        imageName: httpRequest.body.imageName 
    }
    users.push(user)
    httpResponse.status(201).json(user)
})
.get((httpRequest, httpResponse) => {
    httpResponse.status(200).json(users)
})

//http://localhost:5000/api/products/1

controller.route("/:id")
.get((httpRequest, httpResponse) => {
    if (httpRequest.user != undefined)
        httpResponse.status(200).json(httpRequest.user)
    else
        httpResponse.status(404).json()
})
.put((httpRequest, httpResponse) => {
    if (httpRequest.user != undefined) {
        users.forEach(user => {
            if (user.id == httpRequest.user.id) {
                user.articleNumber = httpRequest.body.articleNumber ? httpRequest.body.articleNumber : user.articleNumber
                user.category = httpRequest.body.category ? httpRequest.body.category : user.category
                user.price = httpRequest.body.price ? httpRequest.body.price : user.price
                user.rating = httpRequest.body.rating ? httpRequest.body.rating : user.rating
                user.imageName = httpRequest.body.imageName ? httpRequest.body.imageName : user.imageName

            }
        })
        httpResponse.status(200).json(httpRequest.user)
    }
    else
        httpResponse.status(404).json()
})
.delete((httpRequest, httpResponse) => {
    if (httpRequest.user != undefined) {
        users = users.filter(user => user.id !== httpRequest.user.id)
        httpResponse.status(204).json()
    }
    else
        httpResponse.status(404).json()
})


module.exports = controller