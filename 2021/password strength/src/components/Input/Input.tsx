import React from 'react';
import styles from './Input.module.scss';

type InputProps = {
  onInput: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
};

const Input = ({ onInput, value }: InputProps) => {
  return (
    <div className={styles.inputWrapper}>
      <input type="text" onInput={onInput} value={value} />
    </div>
  );
};

export default Input;
