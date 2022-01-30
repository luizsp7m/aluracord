import styles from "./styles.module.scss";

import { FiUsers } from "react-icons/fi";
import { RiGitRepositoryLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { User } from "../../types";
import { Spinner } from "../Spinner";
import { api } from "../../services/api";

interface PopoverProps {
  username: string;
}

export function Popover({ username }: PopoverProps) {
  const [githubUser, setGithubUser] = useState<User>(null);
  const [githubUserIsLoading, setGithubUserIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setGithubUserIsLoading(true);

    api.get(`/${username}`).then(response => {
      if (mounted) {
        setGithubUser(response.data);
      }
    }).catch(error => {
      if (mounted) {
        setGithubUser(null);
      }
    }).finally(() => {
      window.setTimeout(() => {
        setGithubUserIsLoading(false);
      }, 750);
    });

    return () => { mounted = false }
  }, []);

  return (
    <div className={styles.popover}>
      {githubUserIsLoading ? <Spinner /> : !githubUser ? <p>
        Oops... tente novamente mais tarde
      </p> : <>
        <div className={styles.popoverImage}>
          <img src={githubUser.avatar_url} alt={githubUser.login} />
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
  );
}