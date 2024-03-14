import { DefaultTFuncReturn } from "i18next";
import styles from "./ButtonFancy.module.css";

import {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  MouseEventHandler,
} from "react";

interface IButtonProps {
  type: "button" | "submit" | "reset" | undefined;
  color: string;
  children: JSX.Element | string | null | DefaultTFuncReturn;
  clickHandler: MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
}

const ButtonFancy: React.FC<IButtonProps> = ({
  type,
  color,
  clickHandler,
  children,
  disabled,
}) => {
  return (
    <button
      className={[styles[color], styles.fancyButton].join(" ")}
      type={type}
      onClick={clickHandler}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonFancy;
