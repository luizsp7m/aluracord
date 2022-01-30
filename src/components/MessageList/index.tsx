import styles from "./styles.module.scss";

import { useMessage } from "../../contexts/MessageContext";
import { MessageItem } from "../MessageItem";
import { Spinner } from "../Spinner";
import { useEffect } from "react";

interface MessageListProps {
  user_session: string;
}

export function MessageList({ user_session }: MessageListProps) {
  const { messages, messagesIsLoading } = useMessage();

  useEffect(() => {
    const scrollBar = document.querySelector("#scrollBar");
    scrollBar.scrollTop = scrollBar.scrollHeight;
  }, [messages]);

  return (
    <div id="scrollBar" className={styles.messageList}>
      {messagesIsLoading ? <div className={styles.loading}>
        <Spinner />
      </div> : messages.map(message => (
        <MessageItem
          key={message.id}
          message={message}
          user_session={user_session}
        />
      ))}
    </div>
  );
}