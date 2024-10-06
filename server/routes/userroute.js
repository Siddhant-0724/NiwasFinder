import express from 'express'
import { deleteUser, test, updateUser ,getUserlisting, getUser } from '../controller/usercontroler.js';
import { verifyToken } from '../utlis/verifyUser.js';

const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyToken, updateUser);
router.delete('/delete/:id',verifyToken, deleteUser);
router.get('/listings/:id',verifyToken, getUserlisting);
router.get('/:id',verifyToken, getUser);





export default router;