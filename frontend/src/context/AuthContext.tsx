import {createContext,useContext,useEffect,useState,} from "react";
import axiosInstance from "../helper/axiosHelper";
import type { userProps } from "../component/Login";
import type { AxiosError } from "axios";
import type { apiResponse } from "../Types/ApiResponse";


interface AuthContextProps {
  user: userProps | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<userProps | null>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {

    const [user, setUser] = useState<userProps | null>(null);

    const [loading, setLoading] = useState(true);

    const logout = async () => {
    try {
        await axiosInstance.post("/users/logout");
        // localStorage.removeItem("user");
        setUser(null);
    } 
    catch (error) {
        const axiosError=error as AxiosError<apiResponse<null>>
        console.log(axiosError.response?.data.message);
    }
    };

    const getCurrentUser = async () => {
  try {
    setLoading(true); // 👈 1. Shuru me loading ko explicitly true karein

    const res = await axiosInstance.get("/users/current-user");
    console.log("Current User Response:", res.data);

    // 👈 2. Strict check lagayein ki data sahi format me mil raha hai ya nahi
    if (res.data && res.data.data) {
      setUser(res.data.data.user || res.data.data);
    } else {
      setUser(null);
    }
  } 
  catch (error) {
    const axiosError = error as AxiosError<apiResponse<null>>;
    console.log("Auth Error:", axiosError.response?.data?.message);
    setUser(null);
  } 
  finally {
    setLoading(false); // 👈 3. Sab khatam hone ke BAAD hi loading false hogi
  }
};

    useEffect(() => {
        getCurrentUser();
    }, []);

    // useEffect(() => {
    //     const storedUser = localStorage.getItem("user");

    //     if (storedUser)
    //         setUser(JSON.parse(storedUser));

    //     setLoading(false);
    // }, []);

    return (
    <AuthContext.Provider value={
        {
            user,
            loading,
            setUser,
            logout,
        }
    }
    >
        {children}
    </AuthContext.Provider>
    );
};



export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};