import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [switchState, setSwitchState] = useState(
    () => JSON.parse(localStorage.getItem('switchState')) || false
  );

  useEffect(() => {
    localStorage.setItem('switchState', JSON.stringify(switchState));
    document.body.classList.toggle('dark-theme', switchState);
  }, [switchState]);

  const toggleTheme = () => {
    setSwitchState((prevState) => !prevState);
  };

  return (
    <ThemeContext.Provider value={{ switchState, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};