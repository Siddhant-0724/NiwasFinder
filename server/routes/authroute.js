import express from 'express'
import { signup ,signin,google} from '../controller/authcontroller.js';
import { signoutUser } from '../controller/usercontroler.js';

const router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.get("/signout", signoutUser);



export default router;