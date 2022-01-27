import "../styles/global.scss";

import { MessageProvider } from "../contexts/MessageContext";

function MyApp({ Component, pageProps }) {
  return (
    <MessageProvider>
      <Component {...pageProps} />
    </MessageProvider>
  );
}

export default MyApp;