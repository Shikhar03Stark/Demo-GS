import { Router } from "express";
import ctrl from '../../controllers/movie.js';
import Util from '../../middlewares/util.js';
const router = Router();

router.get('/:movie_id/rating', ctrl.average_rating);

router.use(Util.verify_jwt);
//Protected routes
router.get('/all', ctrl.get_all);
router.post('/:movie_id/rate/:rating', ctrl.rate_movie);


export default router;