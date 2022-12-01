const express = require('express')
const controller = express.Router()
let products = require('../data/database')

controller.param("articleNumber", (req, res, next, articleNumber) => {
    req.product = products.find(x => x.articleNumber == articleNumber)
    next()
})


controller.param("tag", (req, res, next, tag) => {
    req.products = products.filter(x => x.tag == tag)
    next()
})


//Olika controller/routes som gör saker

//För att hämta alla produkter
controller.route('/').get((req, res) => {
    res.status(200).json(products)
})

// För att hämta enstaka produkt beroende på articleNumber
controller.route('/details/:articleNumber').get((req, res) => {
    if(req.product != undefined)
        res.status(200).json(req.product)
    else
        res.status(404).json()
})

//För att hämta produkt beroende på tag
controller.route('/:tag').get((req, res) => {
    if(req.products != undefined)
        res.status(200).json(req.products)
    else
        res.status(404).json()
})

//För att hämta produkt/produkter beroende på tag och antal
controller.route('/:tag/:take').get((req, res) => {
    let list = []

    for (let i = 0; i < Number(req.params.take); i++)
        list.push(req.products[i])

    res.status(200).json(list)

})


module.exports = controller