import Head from "next/head";
import styles from "../styles/chat.module.scss";

import { IoMdSend } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Message, User } from "../types";
import { FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { useMessage } from "../contexts/MessageContext";
import { FiUsers } from "react-icons/fi";
import { RiGitRepositoryLine } from "react-icons/ri";
import { api } from "../services/api";
import Link from "next/link";

interface ChatProps {
  user_session: string;
}

interface MessageListProps {
  user_session: string;
}

interface MessageItemProps {
  user_session: string;
  message: Message;
}

interface InputMessageProps {
  user_session: string;
}

export default function Chat({ user_session }: ChatProps) {
  return (
    <>
      <Head>
        <title>{`Chat | Alura Witcher`}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.chat}>
          <Header />
          <MessageList user_session={user_session} />
          <InputMessage user_session={user_session} />
        </div>
      </div>
    </>
  )
}

function Header() {
  const router = useRouter();

  function logout() {
    destroyCookie(null, "alurawitcher_user");
    router.push("/");
  }

  return (
    <div className={styles.header}>
      <h1>Chat</h1>
      <span onClick={logout}>Logout</span>
    </div>
  );
}

function MessageList({ user_session }: MessageListProps) {
  const { messages, loadingMessages } = useMessage();

  return (
    <div className={styles.messageList}>
      {loadingMessages ? <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
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

function MessageItem({ message, user_session }: MessageItemProps) {
  const { deleteMessage } = useMessage();
  const [loadingDeleteMessage, setLoadingDeleteMessage] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [githubUser, setGithubUser] = useState<User>(null);
  const [githubUserLoading, setGithubUserLoading] = useState(true);

  // Essa função está aqui porque o loading deve aparecer somente para a mensagem que está sendo excluida
  function changeLoading(value: boolean) {
    setLoadingDeleteMessage(value);
  }

  function handleDeleteMessage() {
    deleteMessage({
      id: message.id, changeLoading,
    });
  }

  const dateFormatted = format(new Date(message.created_at), "dd/MM/yyyy HH:mm");

  useEffect(() => {
    if (!showPopover) {
      setGithubUserLoading(true);
      setGithubUser(null);
      return
    }

    setGithubUserLoading(true);
    api.get(`/${message.sender}`)
      .then(response => {
        setGithubUser(response.data);
      })
      .catch(error => {
        setGithubUser(null);
      })
      .finally(() => {
        window.setTimeout(() => {
          setGithubUserLoading(false);
        }, 750);
      })
  }, [showPopover])

  return (
    <div className={styles.message}>
      <div className={styles.messageHeader}>
        <Link href={`https://github.com/${message.sender}`} passHref>
          <a target="_blank">
            <img
              onMouseEnter={() => setShowPopover(true)}
              onMouseLeave={() => setShowPopover(false)}
              src={`https://github.com/${message.sender}.png`}
              alt={message.sender}
            />
          </a>
        </Link>
        <span>{message.sender}</span>
        <time>{dateFormatted}</time>

        {showPopover && (
          <div className={styles.popover}>
            {githubUserLoading ? <div className={styles.spinner} /> : !githubUser ? <p>
              Oops... tente novamente mais tarde
            </p> : <>
              <div className={styles.popoverImage}>
                <img src={`https://github.com/${message.sender}.png`} alt={message.sender} />
              </div>

              <div className={styles.popoverBody}>
                <span>{githubUser.name ? githubUser.name : githubUser.login}</span>

                <div className={styles.popoverFooter}>
                  <label>
                    <FiUsers size={16} color="#edf2f7" />
                    <b>{githubUser.followers}</b> seguidores - <b>{githubUser.following}</b> seguindo
                  </label>

                  <label>
                    <RiGitRepositoryLine size={16} color="#edf2f7" />
                    <b>{githubUser.public_repos}</b> repositórios
                  </label>
                </div>
              </div>
            </>}
          </div>
        )}
      </div>

      <div className={styles.messageBody}>
        <p>{message.content}</p>
      </div>

      {message.sender === user_session && <button disabled={loadingDeleteMessage} onClick={handleDeleteMessage}>
        {loadingDeleteMessage ? <div className={`${styles.spinner} ${styles.delete}`} /> : <MdOutlineDeleteOutline size={18} color="#E53E3E" />}
      </button>}
    </div>
  );
}

function InputMessage({ user_session }: InputMessageProps) {
  const [message, setMessage] = useState("");
  const { createMessage, loadingSubmitMessage } = useMessage();

  async function handleCreateMessage(event: FormEvent) {
    event.preventDefault();

    if (message.trim() === "") return;

    createMessage({ content: message, sender: user_session });

    setMessage("");
  }

  return (
    <form onSubmit={handleCreateMessage} className={styles.inputMessage}>
      <input
        placeholder="Digite uma mensagem aqui"
        type="text"
        value={message}
        onChange={({ target }) => setMessage(target.value)}
      />

      <button type="submit" disabled={loadingSubmitMessage}>
        {loadingSubmitMessage ? <div className={styles.spinner} /> : <IoMdSend size={`2.2rem`} color="#E2E8F0" />}
      </button>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);

  if (!cookies.alurawitcher_user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      }
    }
  }

  return {
    props: {
      user_session: cookies.alurawitcher_user,
    }
  }
}