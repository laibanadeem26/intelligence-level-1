import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ThankyouPage from "./components/ThankyouPage";
import SubscriptionPage from "./components/SubscriptionPage";
import QuizPage from "./components/QuizPage";
import InitPage from "./components/InitPage";
import {
  HOME,
  QUIZ,
  SUBSCRIPTION,
  THANKYOU,
} from "./shared/utils/routePathConstants";
import APIService from "./services/apiService";
import { INIT_PAGE_URL } from "./shared/utils/apiUrl";
import { setLandingData } from "./redux/initSlice";
import {
  landingID,
  password,
  userName,
  version,
} from "./shared/utils/constants";
import { LANGUAGES_TYPE } from "./shared/utils/enums";
import CustomSpinner from "./shared/components/CustomLoader";
import { setLanguage } from "./redux/languageSlice";
import NotFound from "./shared/components/NotFound";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const languagePath = pathname
    .split("/")
    .filter((langPart) => langPart !== "");
  const arExists = languagePath.some((part) => part === "ar");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLanding();
    if (arExists) {
      dispatch(setLanguage(LANGUAGES_TYPE.AR.value));
    } else {
      dispatch(setLanguage(LANGUAGES_TYPE.EN.value));
    }
  }, [dispatch, pathname]);

  const fetchLanding = async () => {
    try {
      setIsLoading(true);
      let formdata = new FormData();
      formdata.append("Username", userName);
      formdata.append("Password", password);
      formdata.append("landing_id", landingID);
      formdata.append("version", version);
      const data = await APIService.post(INIT_PAGE_URL, formdata);
      dispatch(setLandingData(data?.data));
      // Extract query parameters from the URL
      const searchParams = new URLSearchParams(location.search);
      const queryParams = Object.fromEntries(searchParams.entries());
      const { source = "", subsource = "", clickid = "" } = queryParams;
      // Set initial query params for InitPage
      if (source || subsource || clickid) {
        navigate(
          `${HOME}?source=${source}&subsource=${subsource}&clickid=${clickid}`
        );
      }
    } catch (err) {
      console.error("error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <CustomSpinner loading={isLoading} />;

  return (
    <Routes>
      <Route path={`${HOME}/:language`} element={<InitPage />} />
      <Route path={HOME} element={<InitPage />} />
      <Route path={`${QUIZ}/:language`} element={<QuizPage />} />
      <Route path={QUIZ} element={<QuizPage />} />
      <Route path={`${THANKYOU}/:language`} element={<ThankyouPage />} />
      <Route path={THANKYOU} element={<ThankyouPage />} />
      <Route
        path={`${SUBSCRIPTION}/:language`}
        element={<SubscriptionPage />}
      />
      <Route path={SUBSCRIPTION} element={<SubscriptionPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
