import mongoose from "mongoose";
import {DB_name} from '../constant.js'
import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import dnsNative from 'dns';
dnsNative.setDefaultResultOrder('ipv4first');


const DBconnect=async()=>{
    try{
        const connectionInstant=await mongoose.connect(`${process.env.MONGOOSE_URL}/${DB_name}`)
        console.log(`Mongoose connect || DB_host: ${connectionInstant.connection.host}`)
    }
    catch(error:unknown){
        if(error instanceof Error)
            console.log(error.message);
        console.log("MongoDB connection Failed",error)
        process.exit(1);
    }
}


export default DBconnect;