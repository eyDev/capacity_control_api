const jwt = require('jsonwebtoken')

const validateJWT = (req, res, next) => {
    try {
        const token = req.header('x-token')
        if (!token) {
            return res.status(401).json({
                ok: false,
                errors: [
                    {
                        "msg": "No hay token en la petición, inicie sesión denuevo.",
                        "param": "token",
                        "location": "user"
                    }
                ]
            })
        }
        const data = jwt.verify(token, process.env.SECRET_JWT_SEED)
        req.uid = data.uid

        next()
    } catch (e) {
        res.status(401).json({
            ok: false,
            errors: [
                {
                    "msg": "El token no es válido, inicie sesión denuevo.",
                    "param": "token",
                    "location": "user"
                }
            ]
        })
    }
}

module.exports = validateJWT