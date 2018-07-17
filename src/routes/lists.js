const router = require('express').Router()
const ctrl = require('../controllers/lists')
const auth = require('../lib/auth')

//////////////////////////////////////////////////////////////////////////////
// Basic CRUD Methods
//////////////////////////////////////////////////////////////////////////////

router.get('/', auth.isLoggedIn, ctrl.index)
router.post('/', auth.isLoggedIn, ctrl.create)
router.delete('/:id', auth.isAuthorized, ctrl.destroy)

module.exports = router
