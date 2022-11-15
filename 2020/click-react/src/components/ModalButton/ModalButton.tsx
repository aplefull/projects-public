import React, { useMemo } from "react";
import styles from "./ModalButton.module.scss";

type ModalOkButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onMouseOver: React.MouseEventHandler<HTMLDivElement>;
  position: {
    x: number | null;
    y: number | null;
  };
};

const ModalButton = ({
  onClick,
  onMouseOver,
  position,
}: ModalOkButtonProps) => {
  const style = useMemo(() => {
    if (position.x !== null) {
      return {
        top: `${position.y}px`,
        left: `${position.x}px`,
      };
    }

    return {};
  }, [position]);

  return (
    <div
      className={styles.buttonWrapper}
      onMouseOver={onMouseOver}
      style={style}
    >
      <button onClick={onClick}>ok</button>
    </div>
  );
};

export default ModalButton;
