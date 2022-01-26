import { createContext, ReactChild, useContext, useState } from "react";
import { Message } from "../types";

import data from "../data.json";

interface MessageContextData {
  messages: Message[];
  createMessage: (message: Message) => void;
  deleteMessage: (id: string) => void;
}

interface MessageProviderProps {
  children: ReactChild;
}

const MessageContext = createContext({} as MessageContextData);

export function MessageProvider({ children }: MessageProviderProps) {
  const [messages, setMessages] = useState<Message[]>(data.messages);

  function createMessage(message: Message) {
    // const updateMessages = [...messages];
    // updateMessages.push(message);
    // setMessages(updateMessages);
    const updateMessages = [message, ...messages];
    setMessages(updateMessages);
  }

  function deleteMessage(id: string) {
    const updateMessages = [...messages];
    const messageIndex = updateMessages.findIndex(message => message.id === id);
    updateMessages.splice(messageIndex, 1);
    setMessages(updateMessages);
  }
  
  return (
    <MessageContext.Provider value={{
      messages, createMessage, deleteMessage
    }}>
      { children }
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}