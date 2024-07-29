const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).json({error: 'Error fetching users'})
    }
})

usersRouter.get('/:id', async (req, res) =>{
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        res.status(200).json(user)
    } catch (error) {
        console.error('Error fetching user:', error)
        res.status(500).json({error: 'Error fetching user'})
    }
})

usersRouter.post('/', async (req, res) => {
    const { fullName, username, email, password } = req.body
    
    // Check if all required fields are provided
    if (!fullName || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' })
    }

    const saltRounds = 10  // number of salt rounds hashing the password

    try {
        const passwordHash = await bcrypt.hash(password, saltRounds)

        // Create a new User instance with the provided data
        const user = new User({
            fullName,
            username,
            email,
            passwordHash,
            updated_at: new Date(),
            created_at: new Date(),
        })

        const savedUser = await user.save() // Save the use to DB
        res.status(201).json(savedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = usersRouter