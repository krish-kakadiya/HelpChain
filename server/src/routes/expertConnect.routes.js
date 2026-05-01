import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { requestExpert, getMyProblems, getMySessions, getSessionHistory, makeMeExpert } from '../controller/expertConnect.controller.js';

const router = express.Router();

router.post('/request', auth, requestExpert);
router.get('/my-problems', auth, getMyProblems);
router.get('/my-sessions', auth, getMySessions);
router.get('/session/:id', auth, getSessionHistory);
router.post('/debug/make-me-expert', auth, makeMeExpert);

export default router;
