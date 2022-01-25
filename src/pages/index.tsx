import Head from "next/head";
import styles from "../styles/home.module.scss";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "../utils/useDebounce";
import { api } from "../services/api";

interface User {
  login: string;
  avatar_url: string;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [usernameDisplay, setUsernameDisplay] = useState(username);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState(null);

  const router = useRouter();

  function onLogIn(event: FormEvent) {
    event.preventDefault();

    if (user) {
      router.push("/chat");
    }
  }

  const debouncedChange = useDebounce(setUsername, 500);

  function onChangeUsername(value: string) {
    setUsernameDisplay(value);
    debouncedChange(value);
    setError(null);
  }

  async function getUser() {
    try {
      const { data } = await api.get(`${username}`);
      setUser(data);

    } catch (error) {
      setError(error.message);

      setTimeout(() => {
        setError(null);
      }, 4000);

      setUser(null);
    }
  }

  useEffect(() => {
    if (username !== "") {
      getUser();
    } else {
      setUser(null);
    }
  }, [username]);

  return (
    <>
      <Head>
        <title>{`Log In | Alura's Witchers`}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.login}>
          <div className={styles.content}>
            <div>
              <h1>Welcome</h1>
              <span>{`Discord - Alura's Witchers`}</span>
            </div>

            <form onSubmit={onLogIn}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={usernameDisplay}
                onChange={({ target }) => onChangeUsername(target.value)}
                style={{
                  borderColor: error ? "#F56565" : ""
                }}
              />

              {error && <span>{error}</span>}

              <button
                type="submit"
                disabled={username.length <= 2 ? true : false}>Log In</button>
            </form>
          </div>

          <div className={styles.image}>
            <img
              src={user ? user.avatar_url : "/assets/geralt.jpg"}
              alt={`${username} image`}
            />
            <span>{user ? user.login : "Geralt"}</span>
          </div>
        </div>
      </div>
    </>
  );
}