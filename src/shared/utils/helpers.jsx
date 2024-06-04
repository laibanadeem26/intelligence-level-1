import { notification } from "antd";

export const convertToUpperCase = (value) => value?.toUpperCase();

export const convertToLowerCase = (value) => value?.toLowerCase();

export const openNotification = (
  notificationMessage = "",
  type = "error",
  notificationDescription = "",
  className = ""
) => {
  notification.open({
    type,
    message: notificationMessage,
    description: notificationDescription,
    className,
  });
};

export const firstWordCapitalize = (sentence = "") => {
  const words = sentence.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substring(1);
  }

  return words.join(" ");
};
