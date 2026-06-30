import styled from 'styled-components'
import Menu from './Menu'

const SidebarContainer = styled.aside`
  grid-area: sidebar;
  background-color: var(--panel-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 1024px) {
    padding: 16px;
  }

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 65px;
    min-height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 16px 16px 0 0;
    border-top: 1px solid var(--border-color);
    border-left: none;
    border-right: none;
    border-bottom: none;
    box-shadow: 0 -4px 15px rgba(162, 210, 255, 0.12);
    padding: 0 16px;
    z-index: 1000;
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 0;
  }
`;

const SectionTitle = styled.div`
  font-family: "Fredoka", sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  font-weight: 600;
  padding-left: 12px;
  margin-bottom: 6px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export default function Sidebar() {
    return (
        <SidebarContainer>
            <SidebarContent>
                <div>
                    <SectionTitle>เมนู</SectionTitle>
                    <Menu />
                </div>
            </SidebarContent>

        </SidebarContainer>
    )
}