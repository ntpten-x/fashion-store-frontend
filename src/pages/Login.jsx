import { useForm } from "react-hook-form"
import { useLogin } from "../components/authentications/useAuth"
import { useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { useToast } from "../ui/Toast.jsx"

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(3deg); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-color) 0%, #fff0f4 50%, #f0f7ff 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: var(--panel-bg);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${slideUp} 0.5s ease-out;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 25px 50px -12px rgba(162, 210, 255, 0.25);
  }
`;

const LogoIcon = styled.div`
  width: 58px;
  height: 58px;
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  box-shadow: 0 6px 15px rgba(255, 158, 187, 0.3);
  animation: ${float} 4s ease-in-out infinite;
  margin-bottom: 14px;
`;

const Title = styled.h1`
  font-family: "Fredoka", sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
  
  span {
    color: var(--secondary-color);
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-family: "Fredoka", sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-main);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  pointer-events: none;
  transition: color 0.2s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 42px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background-color: var(--bg-color);
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: all 0.2s ease;
  
  &::placeholder {
    color: #a0aec0;
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    background-color: #ffffff;
    box-shadow: 0 0 0 4px var(--primary-light);
    
    & + ${IconWrapper} {
      color: var(--primary-color);
    }
  }
  
  &[type="password"]:focus {
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 4px var(--secondary-light);
    
    & + ${IconWrapper} {
      color: var(--secondary-hover);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #ff6b8b;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: ${slideUp} 0.2s ease-out;
  
  svg {
    flex-shrink: 0;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border-radius: 12px;
  border: none;
  font-family: "Fredoka", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.01);
    background-color: var(--primary-hover);
    box-shadow: var(--shadow-md);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.99);
  }
  
  &:disabled {
    background-color: var(--text-muted);
    opacity: 0.7;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const FooterText = styled.div`
  margin-top: 28px;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  
  span {
    color: var(--primary-color);
    font-weight: 500;
  }
`;

export default function Login() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const { mutate, isLoading } = useLogin({
    onSuccess: (res) => {
      toast.success('Login success')
      queryClient.setQueryData(['user'], res.user)
      navigate('/', { replace: true })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const onSubmit = (data) => {
    mutate({ email: data.email, password: data.password })
  }

  return (
    <Container>
      <Card>
        <LogoIcon>👙</LogoIcon>
        <Title>Sun<span>Babe</span></Title>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <Input
                id="email"
                type="email"
                disabled={isLoading}
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              <IconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </IconWrapper>
            </InputWrapper>
            {errors.email && (
              <ErrorMessage>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {errors.email.message}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <Input
                id="password"
                type="password"
                disabled={isLoading}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <IconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </IconWrapper>
            </InputWrapper>
            {errors.password && (
              <ErrorMessage>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {errors.password.message}
              </ErrorMessage>
            )}
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </SubmitButton>
        </Form>

        <FooterText>
          Powered by <span>SunBabe Co.</span>
        </FooterText>
      </Card>
    </Container>
  )
}

