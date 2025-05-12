'use client';

import { Invite } from './invite';
import { Register } from './register';
import { Verify } from './verify';
import { VerifyCode } from './verify-code';

export default function Page() {
  return (
    <div className='space-y-3'>
      <Invite />
      <Register />
      <VerifyCode />
      <Verify />
    </div>
  );
}
