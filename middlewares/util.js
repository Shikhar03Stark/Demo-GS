import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const {sign} = jwt;

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
        const same = await bcrypt.compare(plain_pass, hashed_pass);
        return same;
    },
}

export default middlewares;