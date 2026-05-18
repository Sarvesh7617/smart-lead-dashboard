import {app} from "./app.js";
import DBconnect from "./db/index.js";





DBconnect()
    .then(()=>{
        app.listen(process.env.PORT || 8000,()=>{
            console.log(`Server is running smooth on port ${process.env.PORT || 8000}`);
        })
    })
    .catch((error:any)=>{
        console.log("DB connection failed", error);
    })