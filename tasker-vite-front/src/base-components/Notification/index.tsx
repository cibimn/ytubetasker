import { useRef, createRef, useEffect } from "react";
import { init, reInit } from "./notification";
import Toastify, { Options } from "toastify-js";
import clsx from "clsx";
import Lucide from "../../base-components/Lucide";


interface CustomOptions extends Options {
  status?: "success" | "failure";
}

export interface NotificationElement extends HTMLDivElement {
  toastify: ReturnType<typeof Toastify>;
  showToast: () => void;
  hideToast: () => void;
  options: Options;
  status: Text;
}

export interface NotificationProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"div"> {
  options: CustomOptions;
  getRef: (el: NotificationElement) => void;
}

function Notification(props: NotificationProps) {
  const initialRender = useRef(true);
  const toastifyRef = createRef<NotificationElement>();
  const icon = props.options.status === "success" ? "CheckCircle" : "XCircle";
  const textColor = props.options.status === "success" ? "text-success" : "text-danger";
  useEffect(() => {
    if (toastifyRef.current) {
      if (initialRender.current) {
        props.getRef(toastifyRef.current);
        init(toastifyRef.current, props);
        initialRender.current = false;
      } else {
        reInit(toastifyRef.current);
      }
    }
  }, [props.options, props.children]);

  const { options, getRef, ...computedProps } = props;
  return (
    <div
      {...computedProps}
      className={clsx([
        "py-5 pl-5 pr-14 bg-white border border-slate-200/60 rounded-lg shadow-xl dark:bg-darkmode-600 dark:text-slate-300 dark:border-darkmode-600 hidden",
        props.className,
      ])}
      ref={toastifyRef}
    >
      <Lucide icon={icon} className={textColor} />
      <div className="ml-4 mr-4">
          <div className="font-medium">
              {props.options.status === "success" ? "Editor Saved!" : "Operation Failed!"}
          </div>
          <div className="mt-1 text-slate-500">
              {props.options?.text || "Notification Text Here"}
          </div>
      </div>
      {props.children}
    </div>
  );
}

Notification.defaultProps = {
  className: "",
  options: {},
  getRef: () => {},
};

export default Notification;
