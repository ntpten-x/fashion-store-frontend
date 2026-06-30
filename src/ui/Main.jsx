import { Outlet } from "react-router-dom";
import styled from "styled-components";

const MainStyled = styled.main`
  grid-area: main;
  background-color: var(--panel-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  padding: 24px;
  overflow-y: auto;
  min-height: 450px;
  animation: fadeIn 0.4s ease-out;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    padding: 16px;
    min-height: 300px;
    overflow-x: hidden;
  }
`;

export default function Main() {
  return (
    <MainStyled>
      <Outlet />
    </MainStyled>
  )
}
