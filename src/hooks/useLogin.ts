import { useState } from 'react';
import { appAuth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';

// 회원가입을 진행하는 훅
export const useLogin = () => {
  // 에러 정보를 저장합니다.
  const [error, setError] = useState(null);
  // 현재 서버와의 통신 상태를 저장합니다.
  const [isPending, setPending] = useState(false);

  const { dispatch } = useAuthContext();

  const login = (email: string, password: string) => {
    setError(null);
    setPending(true);

    // 회원가입이 처리되는 함수
    signInWithEmailAndPassword(appAuth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        dispatch({ type: 'login', payload: user });

        if (!user) {
          throw new Error('로그인에 실패했습니다!');
        }
        setError(null);
        setPending(false);
      })
      .catch((err) => {
        setError(err.message);
        setPending(false);
        console.log(err.message);
        if (err.message.includes('auth/user-not-found')) {
          alert('아이디가 존재하지 않습니다.');
        }
        if (err.message.includes('auth/wrong-password')) {
          alert('비밀번호가 일치하지 않습니다.');
        }
      });
  };
  return { error, isPending, login };
};
