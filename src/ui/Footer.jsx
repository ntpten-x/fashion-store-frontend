import styled from "styled-components";

const FooterStyled = styled.footer`
  grid-area: footer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  background-color: var(--panel-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: "Fredoka", sans-serif;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export default function Footer() {
    return (
        <FooterStyled>
            <div>
                © 2026 . สงวนลิขสิทธิ์
            </div>
        </FooterStyled>
    )
}
