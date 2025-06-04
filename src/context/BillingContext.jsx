import React, { createContext, useState } from "react";

export const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
  const [billData, setBillData] = useState({});

  return (
    <BillingContext.Provider value={{ billData, setBillData }}>
      {children}
    </BillingContext.Provider>
  );
};
