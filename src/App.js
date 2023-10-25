// project import
import React, { useState } from 'react';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { MyUserContext } from './context/UserContext';

function App() {
  const [user, setUser] = useState('');

  return (
    <ThemeCustomization>
    <MyUserContext.Provider value={{ user, setUser }}>
     <ScrollTop>
       <Routes />
     </ScrollTop>
    </MyUserContext.Provider>
 </ThemeCustomization>
  )

}

export default App;
