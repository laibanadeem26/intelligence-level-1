import { useSelector } from "react-redux";
import { Col, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { QUIZ } from "../shared/utils/routePathConstants";
import CustomLayout from "../shared/components/Layout";
import RightSideImage from "../assets/images/RightSideImage.svg";
import { LANGUAGES_TYPE, LANGUAGE_DIRECTIONS } from "../shared/utils/enums";

const { EN } = LANGUAGES_TYPE;
const { RTL, LTR } = LANGUAGE_DIRECTIONS;

const InitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  localStorage.setItem("queryParams", JSON.stringify(queryParams));
  const landingData = useSelector((state) => state.landing.landingData);
  const languageData = useSelector((state) => state.language.language);

  const handleBeginClick = () => {
    if (languageData === EN.value) {
      navigate(QUIZ);
    } else {
      navigate(`${QUIZ}/${languageData}`);
    }
  };

  return (
    <CustomLayout>
      <div
        dir={languageData === EN.value ? LTR.value : RTL.value}
        className="landing-container"
      >
        {/* left section */}
        <Col md={10} sm={24} className="landing-content">
          {/* heading section */}
          <div
            className="landing-page-mainheading"
            dangerouslySetInnerHTML={{
              __html: landingData?.translations?.[
                languageData
              ]?.home_page_title.replace(
                "<span>",
                '<span style="color: #E4FF40;">'
              ),
            }}
          />
          {/* content section */}
          <p className="landing-page-subcontainer">
            {landingData?.translations?.[languageData].home_page_description}
          </p>
          {/* button section  */}
          <Button
            onClick={handleBeginClick}
            className={`${
              languageData === EN.value ? "english-font" : "arabic-font "
            } mt-50 uppercase-text w-40 button-highlight h-55`}
            type="primary"
            size="large"
          >
            <span>
              {landingData?.translations?.[languageData]?.home_page_button_text}
            </span>
          </Button>
        </Col>
        {/* right section */}
        <Col md={8} sm={24}>
          <img
            className="landing-page-image"
            width="500"
            height="600"
            src={RightSideImage}
            alt="Landing Page"
          />
        </Col>
      </div>
    </CustomLayout>
  );
};

export default InitPage;
