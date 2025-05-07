// Meeting-Genius\client\src\components\ContextProvider.jsx

import PropTypes from "prop-types";
import { createContext } from "react";

const authContext = createContext();

const ContextProvider = ({ children }) => {
  const value = {};
  
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ContextProvider, authContext };
