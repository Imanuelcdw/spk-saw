const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const mongoURL = 'mongodb+srv://spk-web:OvuUeStel5SXxNIz@cluster0.adi6c.mongodb.net/spk-saw-laptop?retryWrites=true&w=majority'

const app = express()
const port = 3000

const router = require('./routes/route')

app.set('view engine', 'ejs')

app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

const start = async () => {
  try {
    await mongoose.connect(mongoURL)
    app.listen(port, () => console.log(`Listening to port ${port}`))
  } catch (err) {
    console.error(err)
  }
}
start()
