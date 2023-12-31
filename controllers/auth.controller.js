import { User } from "../models/User.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";


export const register = async (req, res) => {
  const { email, password } = req.body

  try {
    //-buscando por email
    /* let user = await User.findOne({ email }) */
    /* if(user) throw { code: 11000 } */

    const user = new User({ email, password })
    await user.save()

    //-Genera token
    const { token, expiresIn } = generateToken(user._id)
    generateRefreshToken(user._id, res)

    return res.status(201).json({ token, expiresIn })
    
  } catch (error) {
    if(error.code === 11000){
        return res.status(400).json({ error: 'Ya existe el correo'})
    }
    return res.status(500).json({ error: 'Error de servidor'})
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    let user = await User.findOne({ email }) 

    if(!user || !(await user.comparePassword(password))){
        return res.status(403).json({ error: 'Email o Clave incorrecto'}) 
    }

    //-Genera token
    const {token, expiresIn} = generateToken(user._id)
    generateRefreshToken(user._id, res)
    
    return res.json({ token, expiresIn })

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error de servidor' })
  }
}


export const infoUser = async (req, res) => {

  try {
    const user = await User.findById(req.uid).lean()
    return res.json({ id: user._id, email: user.email })
    
  } catch (error) {
    return res.status(500).json({ error: 'Error de servidor' })
  }
}


export const refreshToken = (req, res) => {

  try {
    const {token, expiresIn} = generateToken(req.uid)
    return res.json({ token, expiresIn })

  } catch (error) {
    return res.status(500).json({ error: 'Error de servidor' })
  }
}


export const logout = (req, res) => {
  res.clearCookie('refreshToken')
  res.json({ ok: true })
}