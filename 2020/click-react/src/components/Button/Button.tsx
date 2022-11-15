import React from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onMouseOver: React.MouseEventHandler<HTMLDivElement>;
  position: {
    x: number;
    y: number;
  };
};

const Button = ({ onClick, onMouseOver, position }: ButtonProps) => {
  return (
    <div
      className={styles.wrapper}
      onMouseOver={onMouseOver}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <button onClick={onClick}>Click me!</button>
    </div>
  );
};

export default Button;
