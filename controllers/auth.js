import User from "../models/User.js";
import Util from '../middlewares/util.js';

const auth = {
    signup: async (req, res, next) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            username = String(username).trim();
            password = String(password).trim();
    
            const _user = await User.findOne({username: username});
    
            if(_user){
                next({
                    status: 409,
                    error: `User already exists with username: ${username}`,
                });
                return;
            }
    
            const hashed_password = await Util.hash_password(password);
    
            const newuser = await User.create({
                username, username,
                password: hashed_password,
            });
    
            const jwt = Util.issue_jwt(newuser);
    
            res.status(201).json({
                ok: true,
                data: {
                    user: Object.assign({}, {
                        username: newuser.username,
                        movies_rated: newuser.movies_rated,
                        status: newuser.status,
                        created_at: newuser.created_at,
                    }),
                    token: jwt,
                }
            });
            return;
            
        } catch (error) {
            console.error(error);
            next({
                status: 500,
                error: `Internal server error.`
            });
        }

    },

    login: async (req, res, next) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            username = String(username).trim();
            password = String(password).trim();

            const user = await User.findOne({username: username});
            if(!user){
                next({
                    status: 401,
                    error: `User doesn't exist with given username/password, signup`,
                });
                return;
            }

            const password_matched = await Util.compare_password(password, String(user.password));
            if(!password_matched){
                next({
                    status: 401,
                    error: `Incorrect username/password`,
                });
                return;
            }

            const jwt = Util.issue_jwt(user);

            res.status(200).json({
                ok: true,
                data: {
                    user: Object.assign({}, {
                        username: user.username,
                        movies_rated: user.movies_rated,
                        status: user.status,
                        created_at: user.created_at,
                    }),
                    token: jwt,
                },
            });


            
        } catch (error) {
            console.error(error);
            next({
                status: 500,
                error: `Internal server error`,
            })
        }
    }

}

export default auth;