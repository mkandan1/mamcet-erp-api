import JWT from 'jsonwebtoken';

function generateToken(payload) {
    const token = JWT.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24hr' });
    return token;
}

export { generateToken };