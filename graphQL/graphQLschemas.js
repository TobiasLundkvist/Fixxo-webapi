const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema } = graphql

const Product = require('../schemas/productSchema')


const ProductType = new GraphQLObjectType({
    name: 'Product', 
    fields: () => ({
        _id: { type: GraphQLID },
        tag: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        category: { type: GraphQLString },
        price: { type: GraphQLString },
        rating: { type: GraphQLString },
        imageName: { type: GraphQLString },
    })
})


//Hämta delen
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        product: {
            type: ProductType, 
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Product.findById(args.id)
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                return Product.find({})
            }
        }
    }
})

//CRUD
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addProduct: {
            type: ProductType, 
            args: {
                tag: { type: GraphQLString },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                category: { type: GraphQLString },
                price: { type: GraphQLString },
                rating: { type: GraphQLString },
                imageName: { type: GraphQLString },

            },
            resolve(parent, args) {
                const product = new Product ({
                    tag: args.tag,
                    name: args.name,
                    description: args.description,
                    category: args.category,
                    price: args.price,
                    rating: args.rating,
                    imageName: args.imageName

                })
                return product.save()
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})