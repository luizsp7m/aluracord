import "../styles/global.scss";

import { AuthProvider } from "../contexts/AuthContext";
import { MessageProvider } from "../contexts/MessageContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MessageProvider>
        <Component {...pageProps} />
      </MessageProvider>
    </AuthProvider>
  );
}

export default MyApp;