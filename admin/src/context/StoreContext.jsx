import { createContext, useState, useEffect } from "react";

// Create the context
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");

  useEffect(() => {
    async function loadData() {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }
    loadData()
}, []);

  // Define the context value that will be passed to the provider
  const contextVal = {
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextVal}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
