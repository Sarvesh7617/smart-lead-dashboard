import axios from "axios"; 
import { BASE_URL } from "../config/config";



const axiosInstance=axios.create()



axiosInstance.defaults.baseURL=BASE_URL           //http://localhost:PORT


axiosInstance.defaults.withCredentials=true        //enable cookies base authentication 

export default axiosInstance;