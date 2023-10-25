import  {createContext, useContext} from 'react';

//create a context, with createContext api

export const MyUserContext = createContext({  
  user: '', 
  setUser: () => {}
})

export const useUserContext = () => useContext(MyUserContext);