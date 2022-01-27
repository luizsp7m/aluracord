import { createContext, ReactChild, useContext, useEffect, useState } from "react";
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
  const [messages, setMessages] = useState<Message[]>([]);

  function createMessage(message: Message) {
    const updateMessages = [message, ...messages];
    setMessages(updateMessages);
    localStorage.setItem("@alurawitcher:messages", JSON.stringify(updateMessages));
  }

  function deleteMessage(id: string) {
    const updateMessages = [...messages];
    const messageIndex = updateMessages.findIndex(message => message.id === id);
    updateMessages.splice(messageIndex, 1);
    setMessages(updateMessages);
    localStorage.setItem("@alurawitcher:messages", JSON.stringify(updateMessages));
  }

  useEffect(() => {
    const storageMessages = localStorage.getItem("@alurawitcher:messages");

    if(storageMessages) {
      setMessages(JSON.parse(storageMessages));
      return;
    }

    setMessages(data.messages);
  }, []);
  
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