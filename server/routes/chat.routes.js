import express from "express";
import chatCtrl from "./../controllers/chat.controller";
import { verificarToken } from "./../auth/verificarToken";
import routes from "./../utils/routes-api";

const router = express.Router();
router.route(routes.getAllFriends).get(verificarToken, chatCtrl.getAllFriends);
router.route(routes.stashFriends).get(verificarToken, chatCtrl.getStashFriends);

router.route(routes.getChat).post(verificarToken, chatCtrl.getAllHistory);
router.route(routes.addFriends).post(verificarToken, chatCtrl.addFriends);
router.route(routes.acceptFriends).post(verificarToken, chatCtrl.acceptFriends);
router.route(routes.rejectFriends).post(verificarToken, chatCtrl.cancelFriends);

export default router;
