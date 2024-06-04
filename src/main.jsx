import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import landingReducer from "./redux/initSlice";
import languageReducer from "./redux/languageSlice";
import App from "./App";
import "./index.scss";

const store = configureStore({
  reducer: {
    landing: landingReducer,
    language: languageReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F281B4",
        },
      }}
    >
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </Provider>
);
