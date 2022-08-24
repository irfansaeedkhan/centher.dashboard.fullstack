import "../styles/globals.css";
import { useStore } from "../redux/store";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

/*
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
*/

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);
  const persistor = persistStore(store, {}, function () {
    persistor.persist();
  });

  return (
    <Provider store={store}>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
      {/* <PersistGate persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate> */}
    </Provider>
  );
}
export default MyApp;
