const express = require('express')
const { authorize } = require('../middlewares/authorization')
const controller = express.Router()
const productSchema = require('../schemas/productSchema')


// unsecured routes
//Olika controller/routes som gör saker

//För att hämta alla produkter
controller.route('/').get(async (req, res) => {
    const products = []
    const list = await productSchema.find()
    if(list) {
        for(let product of list) {
            products.push ({
                articleNumber: product._id,
                tag: product.tag,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                rating: product.rating,
                imageName: product.imageName
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})

// För att hämta enstaka produkt beroende på articleNumber
controller.route('/product/details/:articleNumber').get(async (req, res) => {
    const product = await productSchema.findById( req.params.articleNumber )
    if(product) {
        res.status(200).json({
            articleNumber: product._id,
            tag: product.tag,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            rating: product.rating,
            imageName: product.imageName
        })
    } else
        res.status(404).json()


    // if(req.product != undefined)
    //     res.status(200).json(req.product)
    // else
    //     res.status(404).json()
})

//För att hämta produkt beroende på tag
controller.route('/:tag').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag })
    if(list) {
        for(let product of list) {
            products.push ({
                articleNumber: product._id,
                tag: product.tag,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                rating: product.rating,
                imageName: product.imageName
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()

    // if(req.products != undefined)
    //     res.status(200).json(req.products)
    // else
    //     res.status(404).json()
})

//För att hämta produkt/produkter beroende på tag och antal
controller.route('/:tag/:limit').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag }).limit(req.params.limit)
    if(list) {
        for(let product of list) {
            products.push ({
                articleNumber: product._id,
                tag: product.tag,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                rating: product.rating,
                imageName: product.imageName
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()

    
    // let list = []

    // for (let i = 0; i < Number(req.params.take); i++)
    //     list.push(req.products[i])

    // res.status(200).json(list)

})


// secured routes
// Skapa en produkt
controller.route('/').post(authorize, async (req, res) => {
    const { tag, name, description, category, price, rating, imageName } = req.body

    if (!name)
        res.status(400).json({ message: 'Fill in price and name!' })

    const itemExists = await productSchema.findOne({name})
    if (itemExists)
        res.status(409).json({ message: 'Cannot duplicate product' })
    else {
        const product = await productSchema.create({
            tag, 
            name,
            description,
            category,
            price,
            rating,
            imageName
        })
        if(product)
            res.status(201).json({ message: `Product with article number ${product._id} has been created!` })
        else
            res.status(400).json({message: 'Cannot create product.'})
    }
})

// Ta bort en produkt
controller.route('/:articleNumber').delete(authorize, async (req, res) => {
    if(!req.params.articleNumber)
        res.status(400).json('No article was specified')

    const product = await productSchema.findById(req.params.articleNumber)
    if(product) {
        await productSchema.deleteOne(product)
        res.status(200).json({ message: `Product with article number ${req.params.articleNumber} have been deleted` })
    } else {
        res.status(404).json({ message: `Article number ${req.params.articleNumber} was not found` })
    }
})

// Uppdatera en produkt
controller.route('/:articleNumber').put(authorize, async (req, res) => {
    const { tag, name, description, category, price, rating, imageName } = req.body

    try {
        const product = await productSchema.findById( req.params.articleNumber )
        console.log("test product", product)
        if(!product) {
            res.status(404),json()
            console.log("404 error")
        } else {
            const updateProduct = await productSchema.findByIdAndUpdate(req.params.articleNumber, req.body, { new: true })
            console.log("updatedProduct", updateProduct)
        }

    } catch {
        console.log("catch problem")
    }


})



module.exports = controller