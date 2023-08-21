import StyledForm from '../../components/Form';
import { Section, LeftSection, RightSection } from './SignUpStyle';
import Button from '../../components/Button';
import SignUpBack from '../../assets/images/login,signup/signup-bg.png';

const SignUp = () => {
  return (
    <>
      <Section>
        <LeftSection>
          <img className="sinupBackground" src={SignUpBack} alt="배경" />
        </LeftSection>

        <RightSection>
          <h2 className="a11y-hidden">create account</h2>
          <h1>Create Account</h1>
          <StyledForm>
            <label htmlFor="">
              Email
              <input type="email" />
            </label>
            <strong>*올바른 이메일 형식이 아닙니다.</strong>
            <label htmlFor="">
              Password
              <input type="password" />
            </label>
            <label htmlFor="">
              별명
              <input type="text" />
            </label>
            <Button>Sign Up</Button>
          </StyledForm>
        </RightSection>
      </Section>
    </>
  );
};

export default SignUp;
