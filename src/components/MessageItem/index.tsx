import styles from "./styles.module.scss";
import format from "date-fns/format";
import Link from "next/link";

import { useState } from "react";
import { useMessage } from "../../contexts/MessageContext";
import { Message } from "../../types";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Popover } from "../Popover";
import { Spinner } from "../Spinner";

interface MessageItemProps {
  user_session: string;
  message: Message;
}

export function MessageItem({ message, user_session }: MessageItemProps) {
  const { deleteMessage } = useMessage();

  const [deleteMessageIsLoading, setDeleteMessageIsLoading] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  function changeLoading(value: boolean) {
    setDeleteMessageIsLoading(value);
  }

  function onDeleteMessage() {
    deleteMessage({
      id: message.id, changeLoading,
    });
  }

  const dateFormatted = format(new Date(message.created_at), "dd/MM/yyyy HH:mm");

  return (
    <div className={styles.message}>
      <div className={styles.messageHeader}>
        <Link href={`https://github.com/${message.sender}`} passHref>
          <a target="_blank">
            <img
              onMouseEnter={() => setOpenPopover(true)}
              onMouseLeave={() => setOpenPopover(false)}
              src={`https://github.com/${message.sender}.png`}
              alt={message.sender}
            />
          </a>
        </Link>
        <span>{message.sender}</span>
        <time>{dateFormatted}</time>

        {openPopover && (
          <Popover username={message.sender} />
        )}
      </div>

      <div className={styles.messageBody}>
        {message.content.startsWith(":sticker:") ?
          <img src={message.content.replace(":sticker: ", "")} alt="Sticker" /> : <p>{message.content}</p>}
      </div>

      {message.sender === user_session && <button disabled={deleteMessageIsLoading} onClick={onDeleteMessage}>
        {deleteMessageIsLoading ? <Spinner sm={true} /> : <MdOutlineDeleteOutline size={18} color="#E53E3E" />}
      </button>}
    </div>
  );
}