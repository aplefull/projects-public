import React from 'react';
import styles from './Stats.module.scss';

type StatsProps = {
  data: {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    specialSymbols: boolean;
    repeating: boolean;
    popular: boolean;
  };
};

const Stats = ({ data }: StatsProps) => {
  return (
    <div className={styles.statsWrapper}>
      <ul>
        {data.length === 0 && (
          <li>
            <p>Start typing...</p>
          </li>
        )}
        {data.length > 0 && (
          <li>
            <p>Password length: {data.length}</p>
          </li>
        )}
        {data.uppercase && (
          <li>
            <p>Contains Uppercase Letters</p>
          </li>
        )}
        {data.lowercase && (
          <li>
            <p>Contains Lowercase Letters</p>
          </li>
        )}
        {data.numbers && (
          <li>
            <p>Contains Numbers</p>
          </li>
        )}
        {data.specialSymbols && (
          <li>
            <p>Contains Special Symbols</p>
          </li>
        )}
        {data.repeating && (
          <li>
            <p>Has repeating pattern</p>
          </li>
        )}
        {data.popular && (
          <li>
            <p>This password is in top 10000 most popular passwords</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Stats;
