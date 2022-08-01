import styles from "./styles.module.scss";
import data from "../../data.json";

import { IoIosClose } from "react-icons/io";
import { useState } from "react";
import { Sticker } from "../../types";
import { useMessage } from "../../contexts/MessageContext";

interface StickersProps {
  onClose: () => void;
  user_session: string;
}

export function Stickers({ user_session, onClose }: StickersProps) {
  const [stickers, setStickers] = useState<Sticker[]>(data.stickers);
  const { createMessage } = useMessage();

  async function sendSticker(url: string) {
    createMessage({
      content: `:sticker: ${url}`,
      sender: user_session,
      type: "sticker",
    });

    onClose();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onClose}>
          <span>Fechar</span>
        </button>
      </div>

      <div className={styles.stickers}>
        {stickers.map(sticker => (
          <img
            key={sticker.id}
            src={sticker.url}
            alt="Sticker"
            onClick={() => sendSticker(sticker.url)}
          />
        ))}
      </div>
    </div>
  );
}