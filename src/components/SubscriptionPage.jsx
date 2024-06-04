import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Button, Input, Space } from "antd";
import ReactFlagsSelect from "react-flags-select";
import { getCountryCallingCode } from "libphonenumber-js";
import { THANKYOU } from "../shared/utils/routePathConstants";
import CustomLayout from "../shared/components/Layout";
import {
  firstWordCapitalize,
  convertToLowerCase,
  convertToUpperCase,
  openNotification,
} from "../shared/utils/helpers";
import {
  COUNTRY_CODES_LIST,
  LANGUAGES_TYPE,
  LANGUAGE_DIRECTIONS,
  RULE_PREFIXES,
} from "../shared/utils/enums";
import {
  ARABIC_DIGIT_VALIDATIONS,
  ONLY_DIGITS_VALIDATION,
} from "../shared/utils/commonValidations";
import RightSideImage from "../assets/images/RightSideImage.svg";
import APIService from "../services/apiService";
import {
  ADD_SUB,
  PIN_VERIFY,
  UAEHLR_URL,
  VISITOR_IP,
} from "../shared/utils/apiUrl";
import { landingID, miniSiteUrl, password, userName, version } from "../shared/utils/constants";
import ResendOTPModal from "./ResendOTPModal";
import { InputOTP } from "antd-input-otp";

const {
  PREFIX,
  NUMBERS_LENGTH_WITHOUT_COUNTRY_CODE,
  DIGITS_LENGTH,
  FIRST_DIGIT,
} = RULE_PREFIXES;
const { KW } = COUNTRY_CODES_LIST;
const { EN } = LANGUAGES_TYPE;
const { RTL, LTR } = LANGUAGE_DIRECTIONS;

const SubscriptionPage = () => {
  const queryParamsData = localStorage.getItem("queryParams");
  const updatedQueryParams = JSON.parse(queryParamsData);
  const { source, subsource, clickid } = updatedQueryParams;
  const navigate = useNavigate();
  const landingData = useSelector((state) => state.landing.landingData);
  const languageData = useSelector((state) => state.language.language);
  const [isOTP, setIsOTP] = useState(false);
  const [countrySelected, setCountrySelected] = useState("");
  const [legalTextValue, setLegalTextValue] = useState("");
  const [priceTextValue, setPriceTextValue] = useState("");
  const [numberCodeValue, setNumberCodeValue] = useState("");
  const [prefixValue, setPrefixValue] = useState("");
  const [prefixLength, setPrefixLength] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [backendPrefix, setBackendPrefix] = useState("");
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [subServiceId, setSubServiceId] = useState("");
  const [visitorIp, setVisitorIp] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [showResend, setShowResend] = useState(true);
  const [otpTimer, setOTPTimer] = useState(30);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const commonLabelsData = landingData?.common_messages?.[languageData];

  // change Mobile number field
  const handleMobileNumberChange = ({ target: { value } }) => {
    const mobileNumberValue =
      languageData === EN.value
        ? value.replace(ONLY_DIGITS_VALIDATION, "")
        : value.replace(ARABIC_DIGIT_VALIDATIONS, "");
    setMobileNumber(mobileNumberValue);
  };

  useEffect(() => {
    getVistorIp();
  }, []);

  useEffect(() => {
    const updatedInitValues =
      landingData?.[convertToLowerCase(countrySelected)]?.translations?.[
        languageData
      ];
    setLegalTextValue(updatedInitValues?.legal_text);
    setNumberCodeValue(updatedInitValues?.number_example);
    setPriceTextValue(updatedInitValues?.price);
    if (countrySelected) return handlePrefixesAccordingToRules(countrySelected);
  }, [languageData, countrySelected, landingData]);

  useEffect(() => {
    if (otpTimer === 1) {
      setShowResend(false);
    }
  }, [otpTimer]);

  useEffect(() => {
    setCountrySelected(convertToUpperCase(landingData?.default_country));
  }, [landingData]);

  //  this api handles for getting visitors API
  const getVistorIp = async () => {
    try {
      const vistorResponseIp = await APIService.get(VISITOR_IP);
      setVisitorIp(vistorResponseIp?.ip);
    } catch (err) {
      console.error("Error", err);
    }
  };

  //  set prefixes functionality according to mobile number selection
  const handlePrefixesAccordingToRules = useCallback(
    (code) => {
      const rulesData = landingData?.[convertToLowerCase(code)]?.rules;
      setServiceId(landingData?.[convertToLowerCase(code)]?.service_id);
      const countryDialCode = getCountryCallingCode(code);
      setPrefixValue(`+${countryDialCode}`);
      setBackendPrefix(countryDialCode);
      if (rulesData) {
        rulesData.forEach(({ rule_key, rule_value }) => {
          if (rule_key === PREFIX.value) {
            setPrefixValue(rule_value);
          }
          if (
            rule_key === DIGITS_LENGTH.value ||
            rule_key === NUMBERS_LENGTH_WITHOUT_COUNTRY_CODE.value
          ) {
            setPrefixLength(rule_value);
          }
          if (rule_key === FIRST_DIGIT.value) {
            setBackendPrefix(`${countryDialCode}${rule_value}`);
          }
        });
      } else {
        setPrefixValue("");
      }
    },
    [landingData]
  );

  //  this functions trigger on country select in dropdown
  const onCountrySelect = (code) => {
    setPrefixValue("");
    setMobileNumber("");
    setBackendPrefix("");
    setCountrySelected(code);
    handlePrefixesAccordingToRules(code);
  };

  // Add sub case API functionality handled
  const handleAddSubCase = async (subServiceId) => {
    let formdata = new FormData();
    formdata.append("Username", userName);
    formdata.append("Password", password);
    formdata.append("msisdn", `${backendPrefix}${mobileNumber}`);
    formdata.append("SubserviceID", subServiceId);
    formdata.append("source", source);
    formdata.append("Subsource", subsource);
    formdata.append("ClickId", clickid);
    formdata.append("IP", visitorIp);
    formdata.append("minisite", miniSiteUrl);
    formdata.append("userInfo", window.navigator.userAgent);
    try {
      setIsSubscribeLoading(true);
      const responseData = await APIService.post(ADD_SUB, formdata);
      if (responseData === -1) {
        openNotification(commonLabelsData?.incorrect_number);
      } else {
        localStorage.setItem("userId", responseData);
        setIsOTP(true);
        setShowResend(true);
        setOTPTimer(30);
      }
    } catch (err) {
      console.error("Error", err);
    } finally {
      setIsSubscribeLoading(false);
    }
  };

  //  This function trigger when click on OTP submit button
  const handleOTPSubmit = async () => {
    let formdata = new FormData();
    const updatedUserId = localStorage.getItem("userId");
    formdata.append("Username", userName);
    formdata.append("Password", password);
    formdata.append("userID", updatedUserId);
    formdata.append("pincode", pinCode.join(""));
    try {
      setIsOTPLoading(true);
      await APIService.post(PIN_VERIFY, formdata);
      if (languageData === EN.value) {
        navigate(THANKYOU);
      } else {
        navigate(`${THANKYOU}/${languageData}`);
      }
    } catch (err) {
      console.error("Error", err);
    } finally {
      setIsOTPLoading(false);
    }
  };

  //  This should be trigger from subscribe button for UAEHLR Case
  const handleUAEHLRCase = async (event) => {
    event.preventDefault();
    let formdata = new FormData();
    formdata.append("msisdn", `${backendPrefix}${mobileNumber}`);
    formdata.append("landing_id", landingID);
    if (convertToLowerCase(countrySelected) === KW.value) {
      formdata.append("override", 1);
    }
    try {
      setIsSubscribeLoading(true);
      const responseData = await APIService.post(UAEHLR_URL, formdata);
      if (responseData < 1) {
        openNotification(commonLabelsData?.incorrect_number);
      } else {
        handleAddSubCase(responseData);
        setSubServiceId(responseData);
      }
    } catch (err) {
      console.error("Error", err);
    } finally {
      setIsSubscribeLoading(false);
    }
  };

  const onChange = (text) => {
    setPinCode(text);
  };

  const sharedProps = {
    onChange,
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (isOTP || pinCode?.some((item) => item === "")) {
      handleOTPSubmit();
    } else {
      handleUAEHLRCase();
    }
  };

  const handleResendOTP = () => {
    let countdownTimer;

    // Find the paragraph element
    const paragraphElement = document.querySelector(".resend-text");

    // If paragraph element exists
    if (paragraphElement) {
      // Disable click event during timer countdown
      paragraphElement.style.pointerEvents = "none";

      // Apply a CSS style to visually indicate that the text is disabled
      paragraphElement.style.opacity = "0.5"; // Adjust the opacity as needed

      // Start the countdown timer
      countdownTimer = setInterval(() => {
        setOTPTimer((prevTimer) => prevTimer - 1); // Use functional update to decrement timer correctly
      }, 1000);

      // Clear the countdown timer after it reaches 0
      setTimeout(() => {
        clearInterval(countdownTimer);
        // Re-enable click event after timer ends
        paragraphElement.style.pointerEvents = "auto";
        // Reset the opacity to make the text appear enabled
        paragraphElement.style.opacity = "1";
      }, otpTimer * 1000); // Multiply by 1000 to convert seconds to milliseconds
    } else {
      console.error("Paragraph element not found.");
    }
  };

  const handleCancelOTPModal = () => {
    setShowOTPModal(false);
    setIsOTP(false);
    setMobileNumber("");
    setPinCode("");
  };

  return (
    <CustomLayout
      subChildren={
        <div className="top-left cursor-pointer">
          <img
            width={200}
            height={60}
            src={landingData?.assets?.logo}
            alt="Landing Logo"
          />
        </div>
      }
    >
      <div className="subscription-container">
        <Col sm={24} lg={10} className="signup-content">
          <form onSubmit={handleFormSubmit}>
            <div
              dir={languageData === EN.value ? LTR.value : RTL.value}
              className="signup-page-mainheading"
              dangerouslySetInnerHTML={{
                __html: landingData?.translations?.[
                  languageData
                ]?.home_page_title.replace(
                  "<span>",
                  '<span style="color: #E4FF40;">'
                ),
              }}
            />
            <div className="signup-box-container">
              {isOTP ? (
                <>
                  <p
                    dir={languageData === EN.value ? LTR.value : RTL.value}
                    className="signup-number-heading"
                  >
                    {`${commonLabelsData?.otp_text}.`}
                  </p>
                  <div className="signup-otp-container">
                    <InputOTP
                      inputType="custom"
                      inputRegex="[0-9]"
                      inputMode="numeric"
                      {...sharedProps}
                      value={pinCode}
                      inputClassName="input-classname"
                      wrapperClassName="wrapper-classname"
                      length={parseInt(
                        landingData?.[convertToLowerCase(countrySelected)]
                          ?.subservices_rules?.[subServiceId]?.rules?.pin_length
                      )}
                    />
                  </div>
                  <div className="signup-button-container text-center">
                    <Button
                      onClick={handleOTPSubmit}
                      htmlType="submit"
                      className={`${
                        languageData === EN.value
                          ? "english-font"
                          : "arabic-font "
                      } mt-10 uppercase-text w-50 button-highlight h-55`}
                      type="primary"
                      disabled={
                        isOTPLoading ||
                        (pinCode && pinCode.some((item) => item === ""))
                      }
                      loading={isOTPLoading}
                    >
                      {commonLabelsData?.continue}
                    </Button>
                  </div>

                  <div className="text-center mt-20">
                    {showResend ? (
                      <p
                        dir={languageData === EN.value ? LTR.value : RTL.value}
                        onClick={handleResendOTP}
                        className="resend-text"
                      >
                        {`${commonLabelsData?.resend_btn_label} ${otpTimer} ${commonLabelsData?.seconds}`}
                      </p>
                    ) : (
                      <p
                        dir={languageData === EN.value ? LTR.value : RTL.value}
                        onClick={() => setShowOTPModal(true)}
                        className="resend-text"
                      >
                        {commonLabelsData?.resend_otp}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p
                    dir={languageData === EN.value ? LTR.value : RTL.value}
                    className="signup-number-heading"
                  >
                    {`${commonLabelsData?.form_text}.`}
                  </p>
                  <div className="signup-otp-container">
                    <div className="d-column">
                      <ReactFlagsSelect
                        selected={countrySelected}
                        onSelect={onCountrySelect}
                        countries={landingData?.countries.map((countryCode) =>
                          convertToUpperCase(countryCode)
                        )}
                      />
                      <Space.Compact className="mt-10">
                        <Input
                          className="w-20"
                          value={prefixValue}
                          disabled
                          size="large"
                        />
                        <Input
                          className="w-80"
                          size="large"
                          maxLength={prefixLength}
                          value={mobileNumber}
                          onChange={handleMobileNumberChange}
                          inputMode="numeric"
                          placeholder={
                            commonLabelsData?.mobile_number &&
                            firstWordCapitalize(commonLabelsData?.mobile_number)
                          }
                        />
                      </Space.Compact>
                      {numberCodeValue && (
                        <span
                          dir={
                            languageData === EN.value ? LTR.value : RTL.value
                          }
                          className="mt-10 number-code "
                        >
                          {numberCodeValue}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={handleUAEHLRCase}
                      htmlType="submit"
                      className={`${
                        languageData === EN.value
                          ? "english-font"
                          : "arabic-font "
                      } uppercase-text w-60 button-highlight h-55`}
                      type="primary"
                      loading={isSubscribeLoading}
                      size="sm"
                      disabled={
                        !prefixValue ||
                        !countrySelected ||
                        !mobileNumber ||
                        mobileNumber.length != prefixLength ||
                        isSubscribeLoading
                      }
                    >
                      {commonLabelsData?.subscribe}
                    </Button>
                  </div>
                </>
              )}
            </div>
            {priceTextValue && (
              <p
                dir={languageData === EN.value ? LTR.value : RTL.value}
                className="text-center legal-text-container mt-10"
              >
                <b>{priceTextValue}</b>
              </p>
            )}
            <p
              dir={languageData === EN.value ? LTR.value : RTL.value}
              className="text-center legal-text-container mt-10"
            >
              {legalTextValue}
            </p>
          </form>
        </Col>
        <Col sm={24} lg={8} className="ml-30">
          <img
            className="signup-page-image"
            width="500"
            height="650"
            src={RightSideImage}
            alt="Right Side"
          />
        </Col>
      </div>
      <ResendOTPModal
        title={commonLabelsData?.resend_otp}
        confirmButtonName={commonLabelsData?.confirm}
        editNumber={commonLabelsData?.edit_number}
        open={showOTPModal}
        handleCancel={handleCancelOTPModal}
        mobileNumber={`+${backendPrefix}${mobileNumber}`}
        handleConfirm={() => {
          setShowOTPModal(false);
          setShowResend(true);
          setOTPTimer(30);
        }}
      />
    </CustomLayout>
  );
};

export default SubscriptionPage;
