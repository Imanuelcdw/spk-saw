const mongoose = require('mongoose')

const alternativeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  criterias: {
    type: Array,
  },
})

module.exports = mongoose.model('Alternative', alternativeSchema)
