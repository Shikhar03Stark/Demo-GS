import { Router } from "express";
import Validators from '../../middlewares/validate.js';
import ctrl from '../../controllers/auth.js';
const router = Router()

/**
 * route: /v1/auth/signup
 * method: POST
 */
router.post('/signup', Validators.should_exist(['username', 'password']), Validators.validate_username, ctrl.signup);

/**
 * route: /v1/auth/login
 * method: POST
 */
router.post('/login', Validators.should_exist(['username', 'password']), ctrl.login);

export default router;