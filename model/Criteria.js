const mongoose = require('mongoose')

const criteriaSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  value: {
    type: Number,
  },
  atribute: {
    type: String,
  },
})

module.exports = mongoose.model('Criteria', criteriaSchema)
