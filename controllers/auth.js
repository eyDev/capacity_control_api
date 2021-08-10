const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const generateJWT = require('../helpers/generateJWT')

const createUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const existsEmail = await Admin.findOne({ email })
        if (existsEmail) {
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        "msg": "Este correo ya existe",
                        "param": "email",
                        "location": "user"
                    }
                ]
            })
        }
        const adminUser = new Admin(req.body)

        const salt = bcrypt.genSaltSync()
        adminUser.password = bcrypt.hashSync(password, salt)
        await adminUser.save()

        const token = await generateJWT(adminUser.id)
        return res.status(201).json({
            ok: true,
            usuario: adminUser,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "Error Interno.",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const userDB = await Admin.findOne({ email })
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                errors: [
                    {
                        "msg": "Email no encontrado.",
                        "param": "email",
                        "location": "user"
                    }
                ]
            })
        }
        const validatePassword = bcrypt.compareSync(password, userDB.password)
        if (!validatePassword) {
            return res.status(404).json({
                ok: false,
                errors: [
                    {
                        "msg": "Contraseñá Incorrecta!",
                        "param": "email",
                        "location": "user"
                    }
                ]
            });
        }
        const token = await generateJWT(userDB.id)
        return res.status(200).json({
            ok: true,
            usuario: userDB,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "Error Interno.",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
}

const renewToken = async (req, res) => {
    const uid = req.uid
    const token = await generateJWT(uid)
    const usuario = await Admin.findById(uid)

    return res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = {
    createUser,
    login,
    renewToken
}