import { toast } from "react-hot-toast";

export const notifyLoginRequired = () => {
  toast.error("Please register or login to continue");
};

export const notifySuccess = (message: string) => {
  toast.success(message);
};
