import Head from "next/head";
import styles from "../styles/chat.module.scss";

import { IoMdSend } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useMessage } from "../contexts/MessageContext";
import { Message } from "../types";
import { FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";

interface MessageProps extends Message {
}

export default function Chat() {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>{`Chat | Alura Witcher`}</title>
      </Head>

      {!user ? <Unauthenticated /> : (
        <div className={styles.container}>
          <div className={styles.chat}>
            <Header />
            <MessageList />
            <InputMessage />
          </div>
        </div>
      )}
    </>
  )
}


function Header() {
  const { logout } = useAuth();

  return (
    <div className={styles.header}>
      <h1>Chat</h1>
      <span onClick={logout}>Logout</span>
    </div>
  );
}

function MessageList() {
  const { messages } = useMessage();

  return (
    <div className={styles.messageList}>
      {messages.map(message => (
        <MessageItem
          key={message.id}
          id={message.id}
          content={message.content}
          created_at={message.created_at}
          user={message.user}
        />
      ))}
    </div>
  );
}

function MessageItem({ id, content, created_at, user }: MessageProps) {
  const { deleteMessage } = useMessage();
  const { user: { login } } = useAuth();

  const dateFormatted = format(new Date(created_at), "dd/MM/yyyy HH:mm");

  return (
    <div className={styles.message}>
      <div className={styles.messageHeader}>
        <img src={user.avatar_url} alt={user.login} />
        <span>{user.login}</span>
        <time>{dateFormatted}</time>
      </div>

      <div className={styles.messageBody}>
        <p>{content}</p>
      </div>

      {user.login === login && <button onClick={() => deleteMessage(id)}>
        <MdOutlineDeleteOutline size={18} color="#E53E3E" />
      </button>}
    </div>
  );
}

function InputMessage() {
  const { user } = useAuth();
  const { createMessage } = useMessage();

  const [message, setMessage] = useState("");

  function onCreateMessage(event: FormEvent) {
    event.preventDefault();

    if (message.trim() === "") return;

    createMessage({
      id: uuid(),
      content: message,
      created_at: new Date().toISOString(),
      user
    });

    setMessage("");
  }

  return (
    <form onSubmit={onCreateMessage} className={styles.inputMessage}>
      <input
        placeholder="Digite uma mensagem aqui"
        type="text"
        value={message}
        onChange={({ target }) => setMessage(target.value)}
      />

      <button type="submit">
        <IoMdSend size={`2.8rem`} color="#E2E8F0" />
      </button>
    </form>
  );
}

function Unauthenticated() {
  return (
    <div className={styles.container}>
      <div className={styles.unauthenticated}>
        <p>Para continuar você deve se autenticar <Link href="/" passHref>aqui</Link></p>
      </div>
    </div>
  );
}