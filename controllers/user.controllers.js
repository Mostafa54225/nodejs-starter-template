const User = require('../models/User.models')
const { createCustomeError } = require('../errors/custom-error')



const getUsers = async (req, res, next) => {
    const users = await User.find()
    res.status(200).json(users)
}

const getUser = async (req, res, next) => {
    const user = await User.find({username: req.params.username})
    if(!user) return next(createCustomeError('User not found', 404))
    res.status(200).json(user)
}




const dashboard = async (req, res, next) => {
    res.status(200).json(`Welcome ${req.user.username}`)
}


module.exports = {
    getUser,
    getUsers,
    dashboard
}