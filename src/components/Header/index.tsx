import styles from "./styles.module.scss";

import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

interface HeaderProps {
  user_session: string;
}

export function Header({ user_session }: HeaderProps) {
  const router = useRouter();

  function logout() {
    destroyCookie(null, "alurawitcher_user");
    router.push("/");
  }

  return (
    <div className={styles.header}>
      <img src="/assets/favicon.png" alt="Lobo" />

      <div>
        <img src={`https://github.com/${user_session}.png`} alt="" />
        <span onClick={logout}>Sair</span>
      </div>
    </div>
  );
}