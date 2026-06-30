import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLogout, useUser } from '../components/authentications/useAuth';
import { useNavigate } from 'react-router-dom';

const HeaderStyled = styled.header`
  grid-area: header;
  background-color: var(--panel-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Fredoka", sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 480px) {
    font-size: 1.2rem;
    gap: 8px;
  }

  .brand-name {
    display: inline-block;
    color: var(--primary-color);
    
    span {
      color: var(--secondary-color);
    }
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(3deg); }
`;

const LogoIcon = styled.div`
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  box-shadow: 0 6px 15px rgba(255, 158, 187, 0.3);
  animation: ${float} 4s ease-in-out infinite;

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    font-size: 1.05rem;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const UserIconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light);
  border: 2px solid var(--primary-color) !important;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 0 !important;
  box-shadow: var(--shadow-sm);

  &:hover {
    background-color: var(--primary-color) !important;
    color: white !important;
    transform: translateY(-2px) scale(1.02);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background-color: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px;
  min-width: 240px;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 15px;
    width: 10px;
    height: 10px;
    background-color: var(--panel-bg);
    border-left: 1px solid var(--border-color);
    border-top: 1px solid var(--border-color);
    transform: rotate(45deg);
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
`;

const DropdownTitle = styled.span`
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
  font-family: "Fredoka", "Poppins", sans-serif;
`;

const UserEmail = styled.span`
  font-size: 0.85rem;
  color: var(--text-main);
  font-weight: 500;
  word-break: break-all;
  font-family: "Poppins", sans-serif;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px !important;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: #fff0f3 !important;
  color: #ff5c5c !important;
  border: 1px solid #ffd1dc !important;
  border-radius: 12px !important;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none !important;
  transform: none !important;

  &:hover {
    background-color: #ff5c5c !important;
    color: white !important;
    border-color: #ff5c5c !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 12px rgba(255, 92, 92, 0.15) !important;
  }

  &:active {
    transform: translateY(0) !important;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export default function Header() {
  const { mutate: logout, isLoading } = useLogout();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout(null, {
      onSuccess: () => {
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <HeaderStyled>
      <Brand onClick={() => navigate('/')}>
        <LogoIcon>👙</LogoIcon>
        <span className="brand-name">Sun<span>Babe</span></span>
      </Brand>

      <Actions>
        <DropdownContainer ref={dropdownRef}>
          <UserIconButton 
            onClick={toggleDropdown} 
            title="โปรไฟล์ผู้ใช้"
            aria-label="โปรไฟล์ผู้ใช้"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </UserIconButton>

          {isOpen && (
            <DropdownMenu>
              <DropdownHeader>
                <DropdownTitle>บัญชีผู้ใช้</DropdownTitle>
                <UserEmail>{user?.email || 'กำลังโหลด...'}</UserEmail>
              </DropdownHeader>
              <LogoutBtn 
                onClick={handleLogout} 
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {isLoading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
              </LogoutBtn>
            </DropdownMenu>
          )}
        </DropdownContainer>
      </Actions>
    </HeaderStyled>
  );
}

