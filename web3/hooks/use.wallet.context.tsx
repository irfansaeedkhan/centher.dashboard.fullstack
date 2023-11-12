// obviously, this has been simplified to help with the concept

import { createContext, useContext, useEffect, useState } from "react";
import { useWallet } from "./use.wallet";

// fake fetch
function fakeFetchThatErrs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("error msg from our api!"), 1500);
  });
}

// a custom hook to wrap our state
export function useUserFeedback() {
  const [message, setMessage] = useState("");

  return {
    message,
    setMessage,
  };
}

// const wallet = useWallet();
// // our context
// export const UserFeedbackContext = createContext(wallet);

// // a custom hook to access our context
// export function useUserFeedbackContext() {
//   return useContext(UserFeedbackContext);
// }

// your useFetch hook (without the loading component)
// function useFetch() {
//   const [data, setData] = useState(null);
//   // here we use our custom hook to "hook" into the context so we can use the setter!
//   const { connectedAddress } = useUserFeedbackContext();
//   useEffect(() => {
//     // changing this because (a) StackOverflow snippets don't support JSX along with async/await and (b) no need to really fetch here, we'll fake it
//     fakeFetchThatErrs()
//       .then((data) => {
//         // write to our data
//         setData(data);
//       })
//       .catch((err) => {
//         console.log("Error:", err);
//         // uh oh, error! write to our context
//         setMessage(err);
//       });
//   }, [setMessage]);
//   return [data, setData];
// }

// // our demo app component
// function App() {
//   const [data] = useFetch();
//   // consume our context!
//   const { message } = useUserFeedbackContext();

//   return data ? (
//     <div>Success: {data}</div>
//   ) : message ? (
//     <div>Something went wrong: {message}</div>
//   ) : (
//     <div>Fetching...</div>
//   );
// }
