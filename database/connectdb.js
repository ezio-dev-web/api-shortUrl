import mongoose from "mongoose"


try {
   await mongoose.connect(process.env.URI_MONGO)
   console.log('DataBase -> Ready!');

} catch (error) {
   console.log('Error de conexion a moongodb:' + error);
}
