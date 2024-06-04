import { Col } from "antd";
import { useSelector } from "react-redux";
import {
  LANGUAGES_TYPE,
  LANGUAGE_DIRECTIONS,
} from "../shared/utils/enums";
import CustomLayout from "../shared/components/Layout";
import RightSideImage from "../assets/images/RightSideImage.svg";

const { EN } = LANGUAGES_TYPE;
const { RTL, LTR } = LANGUAGE_DIRECTIONS;

const ThankyouPage = () => {
  const landingData = useSelector((state) => state.landing.landingData);
  const languageData = useSelector((state) => state.language.language);
  const finalResultData =
    landingData?.pre_landing?.quiz?.result?.[languageData];

  return (
    <CustomLayout>
      <div
        dir={languageData === EN.value ? LTR.value : RTL.value}
        className="thankyou-maincontainer"
      >
        {/* left section */}
        <Col sm={24} md={12} className="thankyou-content">
          {localStorage.getItem("result") == 1 && (
            <>
              <div
                className="thankyou-main-heading"
                dangerouslySetInnerHTML={{
                  __html: finalResultData?.one?.thankyou.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
              <div
                className="thankyou-page-subcontainer"
                dangerouslySetInnerHTML={{
                  __html: finalResultData?.one?.result.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
              <div
                className="thankyou-description"
                dangerouslySetInnerHTML={{
                  __html: finalResultData?.one?.description.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
              <div
                className="thankyou-short-description"
                dangerouslySetInnerHTML={{
                  __html: landingData?.pre_landing?.quiz?.result?.[
                    languageData
                  ]?.one?.short_description.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
            </>
          )}
          {localStorage.getItem("result") == 2 && (
            <>
              <div
                className="thankyou-main-heading"
                dangerouslySetInnerHTML={{
                  __html: finalResultData?.two?.thankyou.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
              <div
                className="thankyou-page-subcontainer"
                dangerouslySetInnerHTML={{
                  __html: finalResultData?.two?.result.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
              <div
                className="thankyou-description"
                dangerouslySetInnerHTML={{
                  __html: finalResultData?.two?.description.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
              <div
                className="thankyou-short-description"
                dangerouslySetInnerHTML={{
                  __html: landingData?.pre_landing?.quiz?.result?.[
                    languageData
                  ]?.two?.short_description.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
            </>
          )}
          {localStorage.getItem("result") == 3 && (
            <>
              <div
                className="thankyou-main-heading"
                dangerouslySetInnerHTML={{
                  __html: finalResultData?.three?.thankyou.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
              <div
                className="thankyou-page-subcontainer"
                dangerouslySetInnerHTML={{
                  __html: finalResultData?.three?.result.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
              <div
                className="thankyou-description"
                dangerouslySetInnerHTML={{
                  __html: finalResultData?.three?.description.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
              <div
                className="thankyou-short-description"
                dangerouslySetInnerHTML={{
                  __html: landingData?.pre_landing?.quiz?.result?.[
                    languageData
                  ]?.three?.short_description.replace(
                    "<span>",
                    '<span style="color: #E4FF40;">'
                  ),
                }}
              />
            </>
          )}
        </Col>
        {/* right section */}
        <Col sm={24} md={8}>
          <img
            className="thankyou-page-image"
            // width="500"
            // height="600"
            src={RightSideImage}
            alt="Right Side"
          />
        </Col>
      </div>
    </CustomLayout>
  );
};

export default ThankyouPage;
