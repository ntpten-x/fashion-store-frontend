import styled from "styled-components";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import Sidebar from "./Sidebar";

const LayoutContainer = styled.div`
  display: grid;
  grid-template-rows: 75px 1fr auto;
  grid-template-columns: 260px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "sidebar footer";
  min-height: 100vh;
  background-color: var(--bg-color);
  gap: 16px;
  padding: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 220px 1fr;
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
  return (
    <LayoutContainer>
      <Header />
      <Sidebar />
      <Main />
      <Footer />
    </LayoutContainer>
  );
}
