import { Spin } from "antd";
import CustomLoader from "../../assets/images/loader.gif";

const antIcon = (
  <img
    style={{ width: "100px", height: "100px" }}
    src={CustomLoader}
    alt="Loading..."
    spin
  />
);

const CustomSpinner = ({ loading }) => (
  <Spin size="large" spinning={loading} indicator={antIcon} fullscreen />
);

export default CustomSpinner;
