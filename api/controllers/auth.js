const loginRouter = require("express").Router()
const registerRouter = require("express").Router()

const config = require("../utils/config")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// User Login
loginRouter.post("/", async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // compare password from request and passwordHash from DB
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Create the object for token creation
    const userForToken = {
      email: user.email,
      id: user._id,
    }

    // Create the token with userForToken object by signing it with the SECRET key given in .env
    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: "1h" })

    return res.status(200).json({
      token,
      email: user.email,
      username: user.username,
    })
  } catch (error) {
    next(error)
  }
})

// User Registration
registerRouter.post("/", async (req, res, next) => {
  const { username, email, password } = req.body

  // validate request data
  if (
    !email ||
    typeof email !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    return res.status(400).json({ error: "Invalid email or password format" })
  }

  // check if the email is already in use
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ error: "email already in use" })
  }

  // hash the password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Create a new user
  const user = new User({
    username,
    email,
    passwordHash,
  })

  try {
    // save the new user to the database
    const savedUser = await user.save()

    // respond with success message
    res.status(201).json({
      username: savedUser.username,
      email: savedUser.email,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = { loginRouter, registerRouter }
