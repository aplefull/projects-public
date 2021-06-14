import React, { useMemo, useState } from 'react';
import Input from './components/Input/Input';
import Stats from './components/Stats/Stats';
import {
  containsLower,
  containsNumber,
  containsSpecialSymbol,
  containsUpper,
  isPopularPassword,
  isRepeating,
} from './utils/app.utils';

const App = () => {
  const [password, setPassword] = useState('');

  const data = useMemo(() => {
    return {
      length: password.length,
      uppercase: containsUpper(password),
      lowercase: containsLower(password),
      numbers: containsNumber(password),
      specialSymbols: containsSpecialSymbol(password),
      repeating: isRepeating(password, 3),
      popular: isPopularPassword(password),
    };
  }, [password]);

  return (
    <>
      <Input
        value={password}
        onInput={(event) => {
          setPassword(event.target.value);
        }}
      />
      <Stats data={data} />
    </>
  );
};

export default App;
