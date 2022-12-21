require('dotenv').config() 
const port = process.env.PORT || 5000
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoDB = require('./server-mongoDB')
const { graphqlHTTP } = require('express-graphql')



// middleware
app.use(cors()) 
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())


// routes/controllers, för att kunna hämta produkter till sidan och CRUD
const productscontroller = require('./controllers/productsController')
app.use('/api/products', productscontroller)

// route/controller, för att skapa och logga in en användare
app.use('/api/authentication', require('./controllers/authenticationController'))

// graphQL route/controller
app.use('/graphql', graphqlHTTP({
    schema: require('./graphQL/graphQLschemas') ,
    graphiql: true
}))


// start Web API/ initialize
mongoDB()
app.listen(port, () => console.log(`WebApi is running on http://localhost:${port}`))