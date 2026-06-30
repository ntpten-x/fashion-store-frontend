import styled from "styled-components";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import Sidebar from "./Sidebar";
import { useUser } from "../components/authentications/useAuth";

const LayoutContainer = styled.div`
  display: grid;
  grid-template-rows: 75px 1fr auto;
  grid-template-columns: ${props => props.$isLoggedIn ? '260px 1fr' : '1fr'};
  grid-template-areas: ${props => props.$isLoggedIn ? `
    "header header"
    "sidebar main"
    "sidebar footer"
  ` : `
    "header"
    "main"
    "footer"
  `};
  min-height: 100vh;
  background-color: var(--bg-color);
  gap: 16px;
  padding: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: ${props => props.$isLoggedIn ? '220px 1fr' : '1fr'};
    gap: 12px;
    padding: 12px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 65px 1fr auto;
    grid-template-areas:
      "header"
      "main"
      "footer";
    padding: 12px;
    padding-bottom: 80px; /* Space for the bottom navbar on mobile devices */
    gap: 12px;
  }
`;

export default function LayoutApp() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return null;

  const isLoggedIn = !!user;

  return (
    <LayoutContainer $isLoggedIn={isLoggedIn}>
      <Header />
      {isLoggedIn && <Sidebar />}
      <Main />
      <Footer />
    </LayoutContainer>
  );
}
