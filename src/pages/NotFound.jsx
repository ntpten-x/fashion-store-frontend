import styled from "styled-components";
import { Link } from "react-router-dom";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 420px;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ErrorCode = styled.h2`
  font-family: "Fredoka", sans-serif;
  font-size: 3.5rem;
  margin: 0;
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -1px;
`;

const Title = styled.h1`
  font-family: "Fredoka", sans-serif;
  font-size: 1.4rem;
  margin: 12px 0 24px 0;
  color: var(--text-main);
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 9999px;
  font-family: "Fredoka", sans-serif;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    background-color: var(--primary-hover);
    box-shadow: var(--shadow-md);
    color: white;
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

export default function NotFound() {
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <Title>ไม่พบหน้าเว็บนี้</Title>

      <ActionButton to="/">
        กลับสู่หน้าหลัก
      </ActionButton>
    </NotFoundContainer>
  );
}
