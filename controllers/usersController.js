const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler(async (req, res) => {
const users = await User.find().select('-password').lean()
if (!users?.length) {
    return res.status(400).json({message:'Khong tim thay user'})
}
res.json(users)
})


const createUser = asyncHandler(async (req, res) => {
const {username, password, roles } = req.body
if (!username || !password || !Array.isArray(roles) || !roles.length){
    return res.status(400).json({message:'Vui long dien het thong tin'})
}
const duplicate = await User.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec()

if (duplicate){
    return res.status(409).json({message: 'Ten dang nhap da duoc su dung'})
}
const hashedpassword = await bcrypt.hash(password, 10)
const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd }
        : { username, "password": hashedPwd, roles }
const user = await User.create(userObject)
if (user){
    res.status(201).json({message: `Da tao user ${username}`})
}
else {
    res.status(400).json({message: 'That bai'})
}
})

const updateUser = asyncHandler(async (req, res) => {
const {id, username, roles, active, password} = req.body
if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
    return res.status(400).json({message: 'Vui long nhap day du thong tin'})
}
const user = await User.findById(id).exec()
if (!user){
    return res.status(400).json({ message: 'That bai'})
}
const duplicate = await User.findOne({ username}).collation({ locale: 'en', strength: 2 }).lean().exec()

if (duplicate && duplicate?._id.toString() !== id){
    return res.status(409).json({message: 'Ten dang nhap da duoc su dung'})
}

user.username = username
user.roles = roles
user.active = active
if (password){
    user.password = await bcrypt.hash(password, 10)
}
const updateUser = await user.save()
res.json({message: `${updateUser.username} da duoc cap nhat`})
})

const deleteUser = asyncHandler(async (req, res) => {
const {id} = req.body
if (!id){
    return res.status(400).json({message: 'Can ID'})
}
const note = await Note.findOne({user:id}).lean().exec()
if (note){
    return res.status(400).json({message: 'Da nhap note'})
}
const user = await User.findById(id).exec()
if(!user){
    return res.status(400).json({message:'Khong tim thay thong tin'})
}
const result = await user.deleteOne()
const reply = `Ten dang nhap ${result.username} co id ${result._id} da duoc xoa`
res.json(reply)
})
module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}