import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Message } from "../types";
import { createClient } from "@supabase/supabase-js";

interface MessageContextData {
  messages: Message[];
  loadingSubmitMessage: boolean;
  loadingMessages: boolean;
  createMessage: (message: CreateMessageProps) => Promise<void>;
  deleteMessage: ({ changeLoading, id }: DeleteMessageProps) => Promise<void>;
}

interface MessageProviderProps {
  children: ReactNode;
}

interface CreateMessageProps {
  content: string;
  sender: string;
}

interface DeleteMessageProps {
  id: string;
  changeLoading: (value: boolean) => void;
}

const MessageContext = createContext({} as MessageContextData);

const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function MessageProvider({ children }: MessageProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingSubmitMessage, setLoadingSubmitMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);

  async function createMessage(message: CreateMessageProps) {
    setLoadingSubmitMessage(true);
    supabaseClient.from("messages")
      .insert([message])
      .then(({ data }) => {
        setMessages(prevMessages => {
          const newMessages = [data[0], ...prevMessages];
          return newMessages;
        });
        setLoadingSubmitMessage(false);
      })
  }

  async function deleteMessage({ id, changeLoading }: DeleteMessageProps) {
    changeLoading(true);
    supabaseClient
      .from("messages")
      .delete()
      .match({ id })
      .then(({ data }) => {
        setMessages(prevMessages => {
          const newMessages = prevMessages.filter(message => message.id !== data[0].id);
          return newMessages;
        });
        changeLoading(false);
      });
  }

  useEffect(() => { // Primeira renderização da página
    setLoadingMessages(true);
    supabaseClient
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) {
          setMessages(data);
        }

        window.setTimeout(() => {
          setLoadingMessages(false);
        }, 1500);
      })
  }, []);

  return (
    <MessageContext.Provider value={{
      messages, createMessage, loadingSubmitMessage, deleteMessage, loadingMessages
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}