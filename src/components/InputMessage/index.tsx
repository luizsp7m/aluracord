import styles from "./styles.module.scss";

import { FormEvent, useState } from "react";
import { useMessage } from "../../contexts/MessageContext";
import { Stickers } from "../Stickers";
import { IoMdSend } from "react-icons/io";
import { Spinner } from "../Spinner";
import { BsFillStickyFill } from "react-icons/bs";

interface InputMessageProps {
  user_session: string;
}

export function InputMessage({ user_session }: InputMessageProps) {
  const [message, setMessage] = useState("");
  const [openSticker, setOpenSticker] = useState(false);
  const { createMessage, submitMessageIsLoading, submitStickerIsLoading } = useMessage();

  function onClose() {
    setOpenSticker(false);
  }

  async function onCreateMessage(event: FormEvent) {
    event.preventDefault();

    if (message.trim() === "") return;

    createMessage({ content: message, sender: user_session, type: "text" });

    setMessage("");
  }

  return (
    <div className={styles.container}>
      <form onSubmit={onCreateMessage} className={styles.inputMessage}>
        <input
          placeholder="Digite uma mensagem aqui"
          type="text"
          value={message}
          onChange={({ target }) => setMessage(target.value)}
        />

        {openSticker && <Stickers user_session={user_session} onClose={onClose} />}

        <button type="submit" disabled={submitMessageIsLoading}>
          {submitMessageIsLoading ? <Spinner sm={true} /> : <IoMdSend size={`2.2rem`} color="#E2E8F0" />}
        </button>
      </form>

      <button onClick={() => setOpenSticker(!openSticker)} disabled={submitStickerIsLoading}>
        {submitStickerIsLoading ? <Spinner sm={true} /> : <BsFillStickyFill size={`1.8rem`} color="#E2E8F0" />}
      </button>
    </div>
  );
}