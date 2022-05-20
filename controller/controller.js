const math = require('mathjs')
const Criteria = require('../model/Criteria')
const Alternative = require('../model/Alternative')

const index = async (req, res) => {
  // const kriteria = [
  //   { name: 'ijazah', value: 0.3, atribute: 'benefit' },
  //   { name: 'Sertifikasi', value: 0.2, atribute: 'benefit' },
  //   { name: 'Absen', value: 0.2, atribute: 'benefit' },
  //   { name: 'Kedisiplinan', value: 0.15, atribute: 'benefit' },
  //   { name: 'Tanggung Jawab', value: 0.15, atribute: 'benefit' },
  // ]

  // const alternatif = [
  //   {
  //     name: 'A1',
  //     kriteria: [
  //       { name: 'ijazah', value: 70 },
  //       { name: 'Sertifikasi', value: 60 },
  //       { name: 'Absen', value: 80 },
  //       { name: 'Kedisiplinan', value: 50 },
  //       { name: 'Tanggung Jawab', value: 70 },
  //     ],
  //   },
  //   {
  //     name: 'A2',
  //     kriteria: [
  //       { name: 'ijazah', value: 80 },
  //       { name: 'Sertifikasi', value: 70 },
  //       { name: 'Absen', value: 70 },
  //       { name: 'Kedisiplinan', value: 80 },
  //       { name: 'Tanggung Jawab', value: 50 },
  //     ],
  //   },
  //   {
  //     name: 'A3',
  //     kriteria: [
  //       { name: 'ijazah', value: 60 },
  //       { name: 'Sertifikasi', value: 50 },
  //       { name: 'Absen', value: 80 },
  //       { name: 'Kedisiplinan', value: 80 },
  //       { name: 'Tanggung Jawab', value: 70 },
  //     ],
  //   },
  // ]

  // get and transform data

  const criterias = await Criteria.find()
  const alternatives = await Alternative.find()

  alternatives.forEach(async (e) => {
    if (criterias.length < e.criterias.length) {
      e.criterias.length = criterias.length
      await Alternative.findOneAndUpdate(
        { _id: e._id },
        {
          _id: e._id,
          name: e.name,
          criterias: e.criterias,
          __v: e.__v,
        }
      )
    } else if (criterias.length > e.criterias.length) {
      e.criterias[criterias.length - 1] = 0
      await Alternative.findOneAndUpdate(
        { _id: e._id },
        {
          criterias: e.criterias,
        }
      )
    }
  })

  const arrayAlternatif = alternatives.map((a) => a.criterias.map((b) => b))
  //   create matrix and normalization

  const matrix = math.matrix(arrayAlternatif)
  const normalization = matrix.map((value, [x, y], matrix) => {
    const atribute = criterias[y].atribute

    if (atribute == 'benefit') {
      const arrayMax = math.max(matrix._data.map((e) => e[y]))
      return value / arrayMax
    }

    if (atribute == 'cost') {
      const arrayMin = math.min(matrix._data.map((e) => e[y]))
      return arrayMin / value
    }
  })

  //   create ranking from normalization and kriteria value
  let result = []
  for (const key in normalization._data) {
    const data = normalization._data[key]
    const name = alternatives[key].name
    const value = data.map((value, index) => value * criterias[index].value).reduce((a, b) => a + b)
    result.push({ name, value })
  }

  //   Sort ranking value
  result = result.sort((a, b) => a.value - b.value).reverse()

  // res.render('index', { data: sorted, kriteria, alternatif, normalization: normalization._data })
  res.render('index', { criterias, alternatives, result })
}

const addCriteria = async (req, res) => {
  const criteria = await Criteria.create(req.body)
  res.redirect('/')
}

const updateCriteria = async (req, res) => {
  const { id } = req.params
  const criteria = await Criteria.findOneAndUpdate({ _id: id }, req.body)
  res.redirect('/')
}

const deleteCriteria = async (req, res) => {
  const { id } = req.params
  const alternative = await Criteria.deleteOne({ _id: id })
  res.redirect('/')
}

const addAlternative = async (req, res) => {
  let criterias = []
  for (const key in req.body) {
    if (key !== 'name') {
      criterias.push(Number(req.body[key]))
    }
  }
  const result = {
    name: req.body.name,
    criterias,
  }
  const alternatives = await Alternative.create(result)
  res.redirect('/')
}

const updateAlternative = async (req, res) => {
  const { id } = req.params
  const alternatif = await Alternative.find({ _id: id })
  let criterias = []
  for (const key in req.body) {
    if (key !== 'name') {
      criterias.push(Number(req.body[key]))
    }
  }
  const result = {
    name: req.body.name,
    criterias,
  }
  await Alternative.findOneAndUpdate({ _id: id }, result)
  res.redirect('/')
}

const deleteAlternative = async (req, res) => {
  const { id } = req.params
  const alternative = await Alternative.deleteOne({ _id: id })
  res.redirect('/')
}

module.exports = {
  index,
  addCriteria,
  updateCriteria,
  deleteCriteria,
  addAlternative,
  updateAlternative,
  deleteAlternative,
}
