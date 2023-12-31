const Note = require('../models/Note')
const User = require('../models/User')

const asyncHandler = require('express-async-handler')

const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()
    if (!notes?.length) {
        return res.status(400).json({ message: 'Khong tim thay note' })
    }
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'Vui long nhap day du thong tin' })
    }
    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()


    if (duplicate) {
        return res.status(409).json({ message: 'Tieu de trung lap' })
    }
    const note = await Note.create({ user, title, text })

    if (note) { 
        return res.status(201).json({ message: 'Da tao note moi' })
    } else {
        return res.status(400).json({ message: 'That bai' })
    }

})

const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Vui long dien day du thong tin' })
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Khong tim thay' })
    }
    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()


    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Tieu de da duoc su dung' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' da cap nhat`)
})
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Can nhap ID' })
    }
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Khong tim thay' })
    }

    const result = await note.deleteOne()

    const reply = `Note '${result.title}' co ID ${result._id} da duoc xoa`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}