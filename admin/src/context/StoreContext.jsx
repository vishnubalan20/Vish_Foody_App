import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
debugger;
    const url = "http://localhost:4000"
    const [token, setToken] = useState("")


    const contextValue1 = {
        url
    };

    return (
        <StoreContext.Provider value={contextValue1}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;