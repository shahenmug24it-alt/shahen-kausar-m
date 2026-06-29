import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from 'dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGODB_URI

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const registrationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  address: String,
}, { timestamps: true })

const Registration = mongoose.model('Registration', registrationSchema)

app.post('/api/registrations', async (req, res) => {
  try {
    const registration = new Registration(req.body)
    await registration.save()
    res.status(201).json({ message: 'Registration saved' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error saving registration' })
  }
})

app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 })
    res.json(registrations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error fetching registrations' })
  }
})

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas')
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })
