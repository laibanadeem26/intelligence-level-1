import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../redux/languageSlice";
import { LANGUAGES_TYPE } from "../utils/enums";

const { EN, AR } = LANGUAGES_TYPE;

const CustomLayout = ({ children, subChildren }) => {
  const dispatch = useDispatch();
  const languageData = useSelector((state) => state.language.language);

  const handleLanguageChange = () => {
    const newLanguage = languageData === EN.value ? AR.value : EN.value;
    dispatch(setLanguage(newLanguage));
  };

  return (
    <div className="layout-maincontainer">
      {subChildren}
      <div className="top-right">
        <div className="custom-toggle">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={languageData === EN.value ? AR.label : EN.label}
            onClick={handleLanguageChange}
            className="custom-toggle-button"
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default CustomLayout;
