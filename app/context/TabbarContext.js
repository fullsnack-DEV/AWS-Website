// TabBarContext.js
import React, {createContext, useState, useContext, useEffect} from 'react';

const TabBarContext = createContext();

export const TabBarProvider = ({children}) => {
  const [showTabBar, setShowTabBar] = useState(false);

  useEffect(() => {
    setShowTabBar(false);
  }, []);

  const toggleTabBar = (val) => {
    setShowTabBar(val);
  };

  return (
    <TabBarContext.Provider value={{showTabBar, toggleTabBar}}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => useContext(TabBarContext);
