const express = require('express')
const router = express.Router()

const { index, addCriteria, addAlternative, deleteAlternative, deleteCriteria, updateCriteria, updateAlternative } = require('../controller/controller')

router.route('/').get(index)
router.route('/criteria').post(addCriteria)
router.route('/criteria/:id').delete(deleteCriteria).patch(updateCriteria)
router.route('/alternative').post(addAlternative)
router.route('/alternative/:id').delete(deleteAlternative).patch(updateAlternative)

module.exports = router
