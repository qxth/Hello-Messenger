import express from "express";
import userCtrl from "./../controllers/user.controller";
import routes from "./../utils/routes-api";
const router = express.Router();

router.route(routes.createUser).post(userCtrl.registerUser);
router.route(routes.getQuestions).get(userCtrl.getQuestions);

export default router;
