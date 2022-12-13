import React from "react";
export const MessageContext = React.createContext({
    selectedMsg:{message_id:"", message:""},
    setMsgDetails:()=>{}
});

export const useMessageContext = function () {
    return React.useContext(MessageContext);
  };
  
export const MessageProvider = function ({ children }) {
    let [selectedMsg, setMsgDetails] = React.useState({message_id:"", message:""});
    let value = {
        selectedMsg, setMsgDetails
    }
    // setMsgDetails({message_id:"asdfasdf", message:"adsf"})
    // console.log(selectedMsg);
    return (
        <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
    );
};