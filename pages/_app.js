import "../styles/globals.css";
import { useStore } from "../redux/store";
import { Provider } from "react-redux";
import { createWrapper } from 'next-redux-wrapper'
import store from "../redux/store"

import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

/*
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
*/
/*
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
    </Provider>
  );
}
*/
// function MyApp({ Component, pageProps }) {
// 	return (
// 		<>
// 			<Provider store={store}>
// 				<Component {...pageProps} />
// 			</Provider>
// 		</>
// 	)
// }

// export default MyApp;
function MyApp({ Component, pageProps }) {
	return (
		<>
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		</>
	)
}

// initialize store and wrapper store
const makeStore = () => store
const wrapper = createWrapper(makeStore)
export default wrapper.withRedux(MyApp)