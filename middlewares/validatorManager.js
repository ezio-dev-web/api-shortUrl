import axios from 'axios'
import { validationResult, body, param } from 'express-validator'


export const resValidation = (req, res, next) => {
  
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }

  next()
}


export const paramLinkValidator = [
  param("id", "Formato no valido exP")
    .trim()
    .notEmpty()
    .escape()
  ,
  resValidation
]


export const bodyLinkValidator = [
  body("longLink", "Formato de link incorrecto")
    .trim()
    .notEmpty()
    .custom(async value => {
        try {
          if(!value.startsWith("https://")){
              value = "https://" + value
          }

          await axios.get(value)
          return value

        } catch (error) {
          throw new Error('Enlace no encontrado - 404')
        }
    })
  ,
  resValidation
]


export const bodyRegisterValidator = [
  body("email", "Formato de email incorrecto")
  .trim()
  .isEmail()
  .normalizeEmail(),
  body("password", "Minimo 6 caracteres")
  .trim()
  .isLength({ min: 6 })
  .custom((value, {req}) => {
    if(value !== req.body.repassword){
        throw new Error('No coincide las constraseñas')
    }
    return value
  }),
  resValidation,
];


export const bodyLoginValidator = [
  body("email", "Formato de email incorrecto")
  .trim()
  .isEmail()
  .normalizeEmail(),
  body("password", "Minimo 6 caracteres")
  .trim()
  .isLength({ min: 6 }),
  resValidation,
]