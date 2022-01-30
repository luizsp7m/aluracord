import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Message } from "../types";
import { createClient } from "@supabase/supabase-js";

interface MessageContextData {
  messages: Message[];
  submitMessageIsLoading: boolean;
  submitStickerIsLoading: boolean;
  messagesIsLoading: boolean;
  createMessage: (message: CreateMessageProps) => Promise<void>;
  deleteMessage: ({ changeLoading, id }: DeleteMessageProps) => Promise<void>;
}

interface MessageProviderProps {
  children: ReactNode;
}

interface CreateMessageProps {
  content: string;
  sender: string;
  type: string;
}

interface DeleteMessageProps {
  id: string;
  changeLoading: (value: boolean) => void;
}

const MessageContext = createContext({} as MessageContextData);

const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function MessageProvider({ children }: MessageProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [submitMessageIsLoading, setSubmitMessageIsLoading] = useState(false);
  const [submitStickerIsLoading, setSubmitStickerIsLoading] = useState(false);
  const [messagesIsLoading, setMessagesIsLoading] = useState(true);

  async function createMessage(message: CreateMessageProps) {
    if (message.type === "text") {
      setSubmitMessageIsLoading(true);
    } else {
      setSubmitStickerIsLoading(true);
    }

    supabaseClient.from("messages")
      .insert([{
        content: message.content,
        sender: message.sender,
      }])
      .then(() => {
        if (message.type === "text") {
          setSubmitMessageIsLoading(false);
        } else {
          setSubmitStickerIsLoading(false);
        }
      })
  }

  async function deleteMessage({ id, changeLoading }: DeleteMessageProps) {
    changeLoading(true);
    supabaseClient
      .from("messages")
      .delete()
      .match({ id })
      .then(() => {
        changeLoading(false);
      });
  }

  useEffect(() => { // Primeira renderização da página
    setMessagesIsLoading(true);
    supabaseClient
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) {
          setMessages(data);
        }

        window.setTimeout(() => {
          setMessagesIsLoading(false);
        }, 1500);
      })
  }, []);

  useEffect(() => {
    const messagesListener = supabaseClient.from("messages").on("*", payload => {
      if (payload.eventType === "INSERT") {
        setMessages(oldMessages => {
          const newMessage = payload.new;
          const updatedMessages = [newMessage, ...oldMessages];
          return updatedMessages;
        });

        return;
      }

      if (payload.eventType === "UPDATE") {
        return;
      }

      if (payload.eventType === "DELETE") {
        setMessages(oldMessages => {
          const oldMessage = payload.old;
          const updatedMessages = oldMessages.filter(message => message.id !== oldMessage.id);
          return updatedMessages;
        });

        return;
      }
    }).subscribe();

    return () => {
      messagesListener.unsubscribe();
    };
  }, []);

  return (
    <MessageContext.Provider value={{
      messages, createMessage, submitMessageIsLoading, deleteMessage, messagesIsLoading, submitStickerIsLoading
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}