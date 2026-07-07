import { useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const FooterStyled = styled.footer`
  grid-area: footer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: var(--panel-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: "Fredoka", sans-serif;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 6px;
  }
`;

const CopyrightItem = styled.div`
  background-color: var(--bg-color);
  padding: 4px 14px;
  border-radius: 99px;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  font-size: 0.78rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-1px);
  }
`;

const VisitorCountText = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 400;
  margin-top: 2px;
`;

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Footer() {
  const [stats, setStats] = useState({ totalViews: 0 });

  useEffect(() => {
    const socket = io(BASE_URL, {
      transports: ["websocket"]
    });

    socket.on("visitorStats", (data) => {
      setStats({
        totalViews: data.totalViews ?? 0
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <FooterStyled>
      <CopyrightItem>
        ©Sunbabe All Rights Reserved, 2026.
      </CopyrightItem>
      <VisitorCountText title="จำนวนยอดเข้าชมเว็บไซต์ทั้งหมด">
        ยอดการเข้าชมเว็บไซต์ {stats.totalViews.toLocaleString()} ครั้ง
      </VisitorCountText>
    </FooterStyled>
  )
}
