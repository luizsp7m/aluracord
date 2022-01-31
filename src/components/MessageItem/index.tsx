import styles from "./styles.module.scss";
import format from "date-fns/format";
import Link from "next/link";

import { FormEvent, useEffect, useState } from "react";
import { useMessage } from "../../contexts/MessageContext";
import { Message } from "../../types";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { BiPencil } from "react-icons/bi";
import { Popover } from "../Popover";
import { Spinner } from "../Spinner";

interface MessageItemProps {
  user_session: string;
  message: Message;
}

export function MessageItem({ message, user_session }: MessageItemProps) {
  const { deleteMessage, updateMessage } = useMessage();

  const [deleteMessageIsLoading, setDeleteMessageIsLoading] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [inputEditMessageIsOpen, setInputMessageIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState(message.content);
  const [messageUpdateIsLoading, setMessageUpdateIsLoading] = useState(false);

  function onLoadingDelete(value: boolean) {
    setDeleteMessageIsLoading(value);
  }

  function onDeleteMessage() {
    deleteMessage({
      id: message.id, onLoadingDelete,
    });
  }

  function closeInputMessage() {
    setInputMessageIsOpen(false);
  }

  function onLoadingUpdate(value: boolean) {
    setMessageUpdateIsLoading(value);
  }

  async function onEditMessage(event: FormEvent) {
    event.preventDefault();

    if (messageContent.trim() === "") return;

    updateMessage({
      id: message.id,
      content: messageContent,
      closeInputMessage,
      onLoadingUpdate,
    });
  }

  useEffect(() => {
    setMessageContent(message.content);
  }, [inputEditMessageIsOpen]);

  const dateFormatted = format(new Date(message.created_at), `dd MMM. yyyy - HH:mm`);

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
        {message.updated && <h6>Editada</h6>}

        {openPopover && (
          <Popover username={message.sender} />
        )}
      </div>

      <div className={styles.messageBody}>
        {message.content.startsWith(":sticker:") ?
          <img src={message.content.replace(":sticker: ", "")} alt="Sticker" /> : inputEditMessageIsOpen ? <form onSubmit={onEditMessage} className={styles.editMessage}>
            <input
              type="text"
              value={messageContent}
              onChange={({ target }) => setMessageContent(target.value)}
              disabled={messageUpdateIsLoading}
            />

            <button disabled={messageUpdateIsLoading} type="submit">{messageUpdateIsLoading ? <Spinner sm={true} /> : "Salvar"}</button>
          </form> : <p>{message.content}</p>}
      </div>

      {message.sender === user_session && (
        <div className={styles.buttonGroup}>
          {!message.content.startsWith(":sticker:") && !deleteMessageIsLoading && <button onClick={() => setInputMessageIsOpen(!inputEditMessageIsOpen)}>
            {inputEditMessageIsOpen ? <IoIosClose size={22} color="#CBD5E0" /> : <BiPencil size={18} color="#CBD5E0" />}
          </button>}

          {!inputEditMessageIsOpen && <button disabled={deleteMessageIsLoading} onClick={onDeleteMessage}>
            {deleteMessageIsLoading ? <Spinner sm={true} /> : <MdOutlineDeleteOutline size={18} color="#CBD5E0" />}
          </button>}
        </div>
      )}
    </div>
  );
}