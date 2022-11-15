import React, { useCallback, useState } from "react";
import styles from "./Modal.module.scss";
import ModalButton from "../ModalButton/ModalButton";
import classNames from "classnames";

type ModalProps = {
  onCloseRequest: React.MouseEventHandler<HTMLButtonElement>;
  attempts: number;
};

function getTextNode(
  attempts: number,
  secondAttempts: number,
  secondStageHasEnded: boolean
) {
  if (secondAttempts === 0 && !secondStageHasEnded) {
    return (
      <p>
        Ok, you've really just made {attempts} attempts just to click this
        button. I guess i'll go ahead and help you with this. I hope you
        can at least click ok?
      </p>
    );
  }

  if (!secondStageHasEnded) return <h3>Just kidding</h3>;
  if (secondStageHasEnded) return <p>Fine, just do this</p>
  return null;
}

const numberOfAttempts = 6;

const Modal = ({ onCloseRequest, attempts }: ModalProps) => {
  const [secondStageHasEnded, setSecondStageHasEnded] = useState(false);
  const [secondAttempts, setSecondAttempts] = useState(0);
  const [position, setPosition] = useState<{
    x: number | null;
    y: number | null;
  }>({
    x: null,
    y: null,
  });

  const modalClassName = classNames(styles.modal, {
    [styles.notRelative as string]: position.x !== null && !secondStageHasEnded,
  });

  const onMouseOver = useCallback(() => {
    setSecondAttempts((prev) => prev + 1);

    if (!secondStageHasEnded) {
      setPosition({
        y: Math.floor(Math.random() * (window.innerHeight - 40)),
        x: Math.floor(Math.random() * (window.innerWidth - 75)),
      });
    }

    if (secondAttempts > numberOfAttempts) {
      setPosition({
        y: null,
        x: null,
      });
      setSecondStageHasEnded(true);
    }
  }, [secondAttempts, secondStageHasEnded]);

  return (
    <div className={modalClassName}>
      {getTextNode(attempts, secondAttempts, secondStageHasEnded)}
      <ModalButton
        onClick={onCloseRequest}
        onMouseOver={onMouseOver}
        position={position}
      />
    </div>
  );
};

export default Modal;
