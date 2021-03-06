const bcrypt = require('bcryptjs')
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { JWT_SECRET } = require('../../config/env.json')
const { User } = require('../../models')


module.exports = {
    Query: {
        getUsers: async (_, __, { user }) => {
            try {
                if (!user) throw new AuthenticationError('Unauthenticated')

                const users = await User.findAll({
                    where: { username: { [Op.ne]: user.username } },
                })

                return users
            } catch (err) {
                console.log('err getting user', err)
                throw err
            }
        },
        login: async (_, args) => {
            const { username, password } = args
            let errors = {}

            try {
                if (username.trim() === '') errors.username = 'Username must not be empty'
                if (password.trim() === '') errors.password = 'Password must not be empty'

                if (Object.keys(errors).length > 0) {
                    throw new UserInputError('bad input', { errors })
                }

                const user = await User.findOne({ where: { username } })

                if (!user) {
                    errors.username = 'User not found'
                    throw new UserInputError('User not found', { errors })
                }

                const correctPassword = await bcrypt.compare(password, user.password)

                if (!correctPassword) {
                    errors.password = 'Password is not correct'
                    throw new UserInputError('Password is incorrect', { errors })
                }

                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: 60 * 60 })

                return {
                    ...user.toJSON(),
                    createdAt: user.createdAt.toISOString(),
                    token,
                }
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
                if (confirmPassword.trim() === '') errors.confirmPassword = 'Password must not be empty'
                if (password !== confirmPassword) errors.confirmPassword = 'Password must match'

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
                if (err.name === 'SequelizeUniqueConstraintError') {
                    err.errors.forEach(e => (errors[e.path] = `${e.path} is already taken`))
                } else if (err.name === 'SequelizeValidationError') {
                    err.errors.forEach(e => errors[e.path] = e.message)
                }
                throw new UserInputError('Bad Input', { errors })
            }
        },

    }
};