import { User } from "@/app/lib/modal";
import { getCurrentUser } from "@/app/lib/user";
import { createContext, useContext, useEffect, useState } from "react";
type GlobalContextType = {
  user: User | null; 
  setUser: (user: User) => void;
  refreshUser: () => void;
};

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => {},
  refreshUser: () => {},
});

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null) 
  const [refreshCnt, setRefreshUserCnt] = useState(0);
  const getUserInfo = async () =>{
    try { 
      console.log("getUserInfo:","已调用")
      const user = await getCurrentUser();
      if(user){
        setUser(user.data);
      }
    } catch (error) {
      setUser(null)
      throw error;
    }
  }

    useEffect(()=>{getUserInfo()},[refreshCnt])
    
  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        refreshUser: () => setRefreshUserCnt(prev => prev + 1),
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};