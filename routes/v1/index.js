import { Router } from 'express';
import Auth from './auth.js';
import Movie from './movie.js';

const router = Router()
router.use('/auth', Auth);
router.use('/movie', Movie);

export default router;
