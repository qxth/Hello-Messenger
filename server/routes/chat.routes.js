import express from 'express'
import chatCtrl from './../controllers/chat.controller'

const router = express.Router()
router.route('/api/chat/:id')
.get(chatCtrl.getAllHistory)

export default router
