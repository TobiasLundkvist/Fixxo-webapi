const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const controller = express.Router()

const { generateAccessToken } = require('../middlewares/authorization')
const userSchema = require('../schemas/userSchema')


// unsecured route
controller.route('/register').post(async (req, res) => {
    const {firstName, lastName, email, password} = req.body

    if(!firstName || !lastName || !email || !password)
        res.status(400).json({ message: 'First name, last name, email and password is required!' })

    const exists = await userSchema.findOne({email})
    if(exists)
        res.status(409).json({ message: 'A user with the same e-mail exists!' })
    else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userSchema.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        if(user)
            res.status(201).json({ message: 'User account was created, Success! :D' })
        else
            res.status(400).json({ message: 'Cannot create User account..:(' })
    }

})

controller.route('/login').post(async (req, res) => {
    const {email, password} = req.body

    if(!email || !password)
        res.status(400).json({ message: 'E-mail and password is required!' })


    const user = await userSchema.findOne({email})
    if(user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            accessToken: generateAccessToken(user._id)
        })
    } else {
        res.status(400).json({ message: 'Incorrect E-mail or password..:(' })
    }     
})


module.exports = controller
