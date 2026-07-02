import styled from "styled-components";

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  flex-wrap: wrap;
  width: 100%;
`;

export const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 20px;
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--border-color)'};
  background-color: ${props => props.$active ? 'var(--primary-color)' : 'var(--panel-bg)'};
  color: ${props => props.$active ? '#fff' : 'var(--text-main)'};
  font-family: "Fredoka", sans-serif;
  font-weight: ${props => props.$active ? '600' : '400'};
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(255, 111, 145, 0.2)' : 'none'};

  &:hover {
    background-color: ${props => props.$active ? 'var(--primary-color)' : 'var(--primary-light)'};
    border-color: var(--primary-color);
    color: ${props => props.$active ? '#fff' : 'var(--primary-hover)'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    background-color: var(--panel-bg);
    border-color: var(--border-color);
    color: var(--text-muted);
  }
`;
