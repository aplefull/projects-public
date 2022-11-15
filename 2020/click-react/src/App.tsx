import React, { useCallback, useState } from "react";
import Button from "./components/Button/Button";
import song from "./assets/nyan.mp3";
import Modal from "./components/Modal/Modal";

const numberOfAttempts = 10;
const audio = new Audio(song);
audio.volume = 0.05;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [firstStageHasEnded, setFirstStageHasEnded] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 55,
    y: window.innerHeight / 2 - 25,
  });

  const onMouseOver = useCallback(() => {
    setAttempts((prev) => prev + 1);
    setPosition({
      y: Math.floor(Math.random() * (window.innerHeight - 60)),
      x: Math.floor(Math.random() * (window.innerWidth - 120)),
    });

    if (attempts > numberOfAttempts) {
      setFirstStageHasEnded(true);
    }
  }, [attempts]);

  const onClick = useCallback(() => {
    const root = document.querySelector("#root") as HTMLDivElement;
    audio.play();
    root.style.transition = "0.5s ease-in-out";
    root.style.opacity = "0";
  }, []);

  const onCloseRequest = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(onClick, 600);
  }, [onClick]);

  return (
    <>
      {!firstStageHasEnded && (
        <Button
          onMouseOver={onMouseOver}
          onClick={onClick}
          position={position}
        />
      )}
      {isModalOpen && firstStageHasEnded && (
        <Modal onCloseRequest={onCloseRequest} attempts={attempts} />
      )}
    </>
  );
}

export default App;
