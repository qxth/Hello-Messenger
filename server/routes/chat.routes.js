import express from 'express'
import chatCtrl from './../controllers/chat.controller'

const router = express.Router()
router.route('/api/chat')
.post(chatCtrl.getAllHistory)
router.route('/api/friends')
.get(chatCtrl.getAllFriends)

export default router
