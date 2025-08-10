


import { app } from "./src/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT ;

// console.log(PORT);


connectDB()
.then( ()=>{
 
     app.on("error", (err)=>{
        console.log("ERRR :", err);
     })

  app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server is running at PORT : ${PORT}` );
    
  })

})
.catch((err)=>{
   console.log("Mongodb connection failed !!! ", err);
   
})
