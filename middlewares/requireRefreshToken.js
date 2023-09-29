import { tokenVerificarErrores } from "../utils/tokenManager.js";
import jwt from "jsonwebtoken"

export const requireRefreshToken = (req, res, next) => {

   try {
      const tokenCookie = req.cookies.refreshToken;
      if (!tokenCookie) throw new Error('No existe token')

      const { uid }= jwt.verify(tokenCookie, process.env.JWT_REFRESH)
      req.uid = uid
      
      next()


   } catch (error) {
      return res
         .status(401)
         .json({ error: tokenVerificarErrores[error.message] })
   }
}