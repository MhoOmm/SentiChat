const express = require('express')
const pollsRouter = express.Router

const adminAuth= require('../middleware/admin.middleware')

const {createPoll,showPolls,answerPoll}  = require('../controllers/pollsController')

// pollsRouter.post('/createPoll',adminAuth,createPoll)
// pollsRouter.get('/getPoll',showPolls)
// pollsRouter.post('/giveAnswer',answerPoll)


module.exports = pollsRouter
