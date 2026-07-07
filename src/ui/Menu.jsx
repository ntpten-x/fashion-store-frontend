import { NavLink } from "react-router-dom"
import styled from "styled-components"

const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    padding: 0 10px;
  }
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  font-family: "Fredoka", sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: all 0.2s ease;
  background-color: transparent;
  
  &:focus {
    outline: none;
  }

  svg {
    stroke: var(--text-muted);
    width: 18px;
    height: 18px;
    fill: none;
    stroke-width: 2;
    transition: all 0.2s ease;
  }

  span {
    color: inherit;
    font-weight: inherit;
    text-align: center;
  }

  &:hover {
    background-color: var(--primary-light);
    color: var(--primary-color);

    svg {
      stroke: var(--primary-color);
    }
  }

  &.active {
    background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
    color: white;
    box-shadow: 0 4px 10px rgba(162, 210, 255, 0.15);

    svg {
      stroke: white;
    }
    
    span {
      color: white;
    }

    &:hover {
      transform: none;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3px;
    padding: 6px 4px;
    font-size: 0.72rem;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 75px;
    scroll-snap-align: start;
    
    svg {
      width: 16px;
      height: 16px;
    }
    
    &.active {
      box-shadow: none;
      background: transparent;
      color: var(--primary-color);
      
      svg {
        stroke: var(--primary-color);
      }
      
      span {
        color: var(--primary-color);
        font-weight: 600;
      }
    }
    
    &:hover {
      background-color: transparent;
    }
  }
`;

export default function Menu() {
  return (
    <MenuList>
      <MenuItem to="/" end>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>หน้าแรก</span>
      </MenuItem>

      <MenuItem to="/category">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>หมวดหมู่</span>
      </MenuItem>

      <MenuItem to="/colors">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
          <circle cx="7.5" cy="10.5" r="1.5" />
          <circle cx="11.5" cy="7.5" r="1.5" />
          <circle cx="16.5" cy="9.5" r="1.5" />
          <circle cx="15.5" cy="14.5" r="1.5" />
        </svg>
        <span>สีสินค้า</span>
      </MenuItem>

      <MenuItem to="/size">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
          <line x1="6" y1="7" x2="6" y2="12" />
          <line x1="10" y1="7" x2="10" y2="12" />
          <line x1="14" y1="7" x2="14" y2="12" />
          <line x1="18" y1="7" x2="18" y2="12" />
        </svg>
        <span>ขนาดสินค้า</span>
      </MenuItem>

      <MenuItem to="/products">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <span>จัดการสินค้า</span>
      </MenuItem>

      <MenuItem to="/contact">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span>การติดต่อ</span>
      </MenuItem>

      <MenuItem to="/location">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>ที่อยู่</span>
      </MenuItem>
    </MenuList>
  )
}
