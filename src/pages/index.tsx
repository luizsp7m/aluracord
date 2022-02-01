import Head from "next/head";
import styles from "../styles/home.module.scss";

import { FormEvent, useEffect, useState } from "react";
import { useDebounce } from "../utils/useDebounce";
import { FiUsers } from "react-icons/fi";
import { GetServerSideProps } from "next";
import { parseCookies, setCookie } from "nookies";
import { User } from "../types";
import { api } from "../services/api";
import { useRouter } from "next/router";
import { Spinner } from "../components/Spinner";

export default function Home() {
  const [user, setUser] = useState<User>(null);
  const [username, setUsername] = useState("");
  const [usernameDisplay, setUsernameDisplay] = useState(username);
  const [error, setError] = useState(null);
  const [githubUserIsLoading, setGithubUserIsLoading] = useState(false);

  const router = useRouter();

  const debouncedChange = useDebounce(setUsername, 750);

  function onChangeUsername(value: string) {
    setUsernameDisplay(value);
    debouncedChange(value);
    setError(null);
  }

  function onError(message: string) {
    setError(message);

    window.setTimeout(() => {
      setError(null)
    }, 4000);
  }

  function onLogin(event: FormEvent) {
    event.preventDefault();

    if (!user) {
      onError("Usuário inválido");
      return;
    }

    const discordjoin = new Audio();
    discordjoin.src = "/assets/discordjoin.mp3";
    discordjoin.play();

    setCookie(null, "alurawitcher_user", user.login, {
      maxAge: 86400 * 30,
      path: "/",
    });

    router.push(`/chat?username=${user.login}`);
  }

  useEffect(() => {
    if (username.trim() === "") {
      setUser(null);
      setGithubUserIsLoading(false);
      return;
    }

    setGithubUserIsLoading(true);
    api.get(`/${username}`).then(response => {
      setUser(response.data);
    }).catch(error => {
      onError(error.message);
      setUser(null);
    }).finally(() => {
      setGithubUserIsLoading(false);
    });
  }, [username]);

  return (
    <>
      <Head>
        <title>Log In | Alura Witcher</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.login}>
          <div className={styles.welcome}>
            <h1>Boas-vindas de volta!</h1>
            <span>Discord - Alura Witcher</span>
          </div>

          <div className={styles.profile}>
            <img
              src={user ? user.avatar_url : "/assets/avatar-default.png"}
              alt="Avatar"
            />

            <span>{user ? user.login : "Usuário anônimo"}</span>

            <div className={styles.profileInformation}>
              <FiUsers size={16} color="#edf2f7" />
              <label>
                <b>{user ? user.followers : "0"}</b> seguidores - <b>{user ? user.following : "0"}</b> seguindo
              </label>
            </div>
          </div>

          <form className={styles.form} onSubmit={onLogin}>
            <span>
              <label>Usuário</label>
              <h6>{error}</h6>
            </span>

            <div className={styles.inputGroup} style={{
              borderColor: error ? "#F56565" : ""
            }}>
              <input
                type="text"
                value={usernameDisplay}
                onChange={({ target }) => onChangeUsername(target.value)}
                autoComplete="nope"
              />

              {githubUserIsLoading && <Spinner sm={true} />}
            </div>

            <button
              type="submit"
              disabled={githubUserIsLoading}>
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);

  if (cookies.alurawitcher_user) {
    return {
      redirect: {
        permanent: false,
        destination: "/chat",
      }
    }
  }

  return {
    props: {

    }
  }
}