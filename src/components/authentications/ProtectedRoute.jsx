import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import styled, { keyframes } from "styled-components";
import { useUser } from "./useAuth";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-color) 0%, #fff0f4 50%, #f0f7ff 100%);
  gap: 20px;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OuterRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid var(--primary-light);
  border-top-color: var(--primary-color);
  border-bottom-color: var(--secondary-color);
  border-radius: 50%;
  animation: ${spin} 1.5s linear infinite;
`;

const InnerEmoji = styled.div`
  font-size: 2.2rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const LoadingText = styled.p`
  font-family: "Fredoka", "Poppins", sans-serif;
  color: var(--text-main);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.5px;
`;

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isLoading, data: user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <SpinnerWrapper>
          <OuterRing />
          <InnerEmoji>👙</InnerEmoji>
        </SpinnerWrapper>
        <LoadingText>กำลังโหลด... 🌸</LoadingText>
      </LoadingContainer>
    );
  }

  return user ? children : null;
}

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};