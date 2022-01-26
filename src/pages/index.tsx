import Head from "next/head";
import styles from "../styles/home.module.scss";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "../utils/useDebounce";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const [username, setUsername] = useState("");
  const [usernameDisplay, setUsernameDisplay] = useState(username);
  const [error, setError] = useState(null);
  const { user, getUser } = useAuth();

  const router = useRouter();

  function onLogIn(event: FormEvent) {
    event.preventDefault();

    if (user) {
      router.push("/chat");
    } else {
      onError("Username invalid");
    }
  }

  const debouncedChange = useDebounce(setUsername, 750);

  function onChangeUsername(value: string) {
    setUsernameDisplay(value);
    debouncedChange(value);
    setError(null);
  }

  function onError(message: string) {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 4000);
  }

  useEffect(() => {
    getUser({ username, onError });
  }, [username]);

  return (
    <>
      <Head>
        <title>Log In | Alura Witcher</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.login}>
          <div className={styles.content}>
            <div>
              <h1>Welcome</h1>
              <span>Discord - Alura Witcher</span>
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
            {user && (
              <>
                <img
                  src={user.avatar_url}
                  alt={user.login}
                />

                <span>{user.login}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}