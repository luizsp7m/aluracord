import Head from "next/head";
import styles from "../styles/home.module.scss";

import { FormEvent, useEffect, useState } from "react";
import { useDebounce } from "../utils/useDebounce";
import { useAuth } from "../contexts/AuthContext";
import { FiUsers } from "react-icons/fi";

export default function Home() {
  const { user, getUser, login } = useAuth();

  const [username, setUsername] = useState("");
  const [usernameDisplay, setUsernameDisplay] = useState(username);
  const [error, setError] = useState(null);

  function onLogin(event: FormEvent) {
    event.preventDefault();
    login({ onError });
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

            <input
              id="username"
              type="text"
              value={usernameDisplay}
              onChange={({ target }) => onChangeUsername(target.value)}
              style={{
                borderColor: error ? "#F56565" : ""
              }}
            />

            <button
              type="submit"
              disabled={username.length <= 0 ? true : false}>Log In</button>
          </form>
        </div>
      </div>
    </>
  );
}