import 'dotenv/config';
import "./database/connectdb.js"
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import authRouter from './routes/auth.route.js'
import linkRouter from './routes/link.route.js'
import redirectRouter from './routes/redirect.route.js'


const app = express()
const PORT = process.env.PORT || 5000
const whiteList = [process.env.ORIGIN, process.env.ORIGIN2]


app.listen(PORT, () => console.log(`Server -> http://localhost:${PORT}`))
app.use(
  cors({
    origin: function(origin, callback){
        
        if(!origin || whiteList.includes(origin)){
          console.log( "Nice 🚀 => ", origin);
          return callback(null, origin)
        }
        return callback(
          "Alerta! 🚨: " + origin + " No autorizado!"
        )
    },
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"));
app.use('/', redirectRouter) //-optional
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/links', linkRouter) //