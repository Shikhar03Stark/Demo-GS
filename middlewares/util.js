import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const {sign, verify} = jwt;

const middlewares = {
    issue_jwt: (user) => {
        const payload = {id:user.id};
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'demo');
        return token;
    },

    hash_password: async (password) => {
        const hashed_pass = await bcrypt.hash(password, 12);
        return hashed_pass;
    },

    compare_password: async (plain_pass, hashed_pass) => {
        console.log({plain_pass, hashed_pass});
        const same = await bcrypt.compare(plain_pass, hashed_pass);
        return same;
    },

    verify_jwt: async (req, res, next) => {
        try {
            const bearer_token = req.get('Authorization');
            if(!bearer_token){
                next({
                    status: 401,
                    error: 'Unauthorized, provide a token'
                });
                return;
            }
            else{
                const token = bearer_token.substr('Bearer '.length);
                const payload = jwt.verify(token, process.env.JWT_SECRET || 'demo');
                const id = payload.id;
                const user = await User.findOne({id: id});
                if(!user){
                    next({
                        status: 401,
                        error: `Unauthorized, invalid token`,
                    });
                    return;
                }
                else{
                    req.user = user;
                    next();
                }
            }
            
        } catch (error) {
            console.error(error);
            next({
                status: error.status || 500,
                error: error.error || 'Internal server error',
            });
        }
    },
}

export default middlewares;