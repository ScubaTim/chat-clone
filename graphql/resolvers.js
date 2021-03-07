const bcrypt = require('bcryptjs')
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const { User } = require('../models')

module.exports = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.findAll()

                return users
            } catch (err) {
                console.log('err getting user', err)
            }
        },
        login: async (_, args) => {
            const { username, password } = args
            let errors = {}

            try {

                const user = await User.findOne({
                    where: { username }
                })

                if (!user) {
                    errors.username = 'user not found'
                    throw new UserInputError('user not found', { errors })
                }

                const correctPassword = await bcrypt.compare(password, user.password)

                if (!correctPassword) {
                    errors.password = 'password is not correct'
                    throw new AuthenticationError('password is  incorrect', { errors })
                }

                const token = jwt.sign({
                    username
                }, JWT_SECRET, { expiresIn: 60 * 60 })

                user.token = token

                return user
            } catch (err) {
                console.log(err)
                throw err
            }
        }
    },
    Mutation: {
        register: async (_, args) => {
            let { username, email, password, confirmPassword } = args
            let errors = {}

            try {
                if (email.trim() === '') errors.email = 'Email must not  be empty'
                if (username.trim() === '') errors.username = 'Username must not  be empty'
                if (password.trim() === '') errors.password = 'Password must not  be empty'
                if (confirmPassword.trim() === '') errors.confirmPassword = 'repeat password must not be empty'

                if (Object.keys(errors).length > 0) {
                    throw errors;
                }

                password = await bcrypt.hash(password, 6)

                const user = await User.create({
                    username,
                    email,
                    password
                })

                return user
            } catch (err) {
                console.log('dev-log: error creating user', err)
                throw new UserInputError('Bad Input', { errors: err })
            }
        }
    }
};