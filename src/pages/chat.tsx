import Head from "next/head";
import styles from "../styles/chat.module.scss";

import { Header } from "../components/Header";
import { MessageList } from "../components/MessageList";
import { InputMessage } from "../components/InputMessage";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { Sidebar } from "../components/Sidebar";

interface ChatProps {
  user_session: string;
}

export default function Chat({ user_session }: ChatProps) {
  return (
    <>
      <Head>
        <title>{`Chat | Alura Witcher`}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.chat}>
            <Header user_session={user_session} />
            <MessageList user_session={user_session} />
            <InputMessage user_session={user_session} />
          </div>

          <Sidebar />
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);

  const { query } = context;

  if (!cookies.alurawitcher_user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      }
    }
  }

  if (query.username) {
    return {
      props: {
        user_session: query.username,
      }
    }
  }

  return {
    props: {
      user_session: cookies.alurawitcher_user,
    }
  }
}