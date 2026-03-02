'use client';

import { useState } from 'react';
import SubmitButton from './SubmitButton';
import Header from './Header';
import ShowPasswordButton from './ShowPasswordButton';
import CustomInputField from './CustomInputField';
import AnimatedDiv from '@/components/animation-core/AnimatedDiv';

const TextInputFields = ({ inputType }: { inputType: 'login' | 'signup' }) => {
  const [viewPassword, setViewPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [emailFocused, setEmailFocused] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [firstNameValue, setFirstNameValue] = useState('');
  const [lastNameValue, setLastNameValue] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastNameFocused, setLastNameFocused] = useState(false);

  const handleTogglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setViewPassword(!viewPassword);
  };

  const handleSubmit = () => {
    console.log('Submitted');
  };

  return (
    <AnimatedDiv className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900 z-50">
      <Header inputType={inputType} />

      {inputType === 'signup' && (
        <>
          <CustomInputField
            id="first-name"
            type="text"
            name="first-name"
            value={firstNameValue}
            onChange={e => setFirstNameValue(e.target.value)}
            onFocus={() => setFirstNameFocused(true)}
            onBlur={() => setFirstNameFocused(false)}
            placeholder=""
            required
            label="First Name"
          />
          <CustomInputField
            id="last-name"
            type="text"
            name="last-name"
            value={lastNameValue}
            onChange={e => setLastNameValue(e.target.value)}
            onFocus={() => setLastNameFocused(true)}
            onBlur={() => setLastNameFocused(false)}
            placeholder=""
            required
            label="Last Name"
          />
        </>
      )}

      {/* EMAIL INPUT */}
      <CustomInputField
        id="email"
        type="email"
        name="email"
        value={emailValue}
        onChange={e => setEmailValue(e.target.value)}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
        placeholder=""
        required
        label="Email"
      />

      {/* PASSWORD INPUT */}
      <CustomInputField
        id="password"
        type={viewPassword ? 'text' : 'password'}
        name="password"
        value={passwordValue}
        onChange={e => setPasswordValue(e.target.value)}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        placeholder=""
        required
        label="Password"
      >
        <ShowPasswordButton
          viewPassword={viewPassword}
          handleTogglePassword={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleTogglePassword(e)
          }
        />
      </CustomInputField>

      {/* SUBMIT BUTTON */}
      <SubmitButton variant={inputType} onClick={handleSubmit} />
    </AnimatedDiv>
  );
};

export default TextInputFields;
