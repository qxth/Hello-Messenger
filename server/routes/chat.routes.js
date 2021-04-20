import express from 'express'
import chatCtrl from './../controllers/chat.controller'
import {verificarToken} from './../auth/verificarToken'

const router = express.Router()
router.route('/api/friends')
.get(verificarToken, chatCtrl.getAllFriends)
router.route('/api/stashfriends')
.get(verificarToken, chatCtrl.getStashFriends)

router.route('/api/chat')
.post(verificarToken, chatCtrl.getAllHistory)
router.route('/api/addfriends')
.post(verificarToken, chatCtrl.addFriends)
router.route('/api/acceptfriends')
.post(verificarToken, chatCtrl.acceptFriends)
router.route('/api/rejectfriends')
.post(verificarToken, chatCtrl.cancelFriends)

export default router
