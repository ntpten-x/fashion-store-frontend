import { useEffect, useRef, useState } from "react"
import { SelectLocation } from "../../services/apiLocation"
import PropTypes from "prop-types"
import styled from "styled-components"

const Title = styled.h3`
  font-family: "Fredoka", sans-serif;
  font-size: 1.25rem;
  color: var(--text-main);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 380px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  background-color: var(--bg-color);
  position: relative;

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const ShopImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
  position: relative;
  
  @media (max-width: 480px) {
    height: 130px;
    margin-bottom: 12px;
  }
`;

const ShopImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const CancelButton = styled.button`
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 0.88rem;
  background-color: transparent;
  border: 1.5px solid var(--border-color);
  color: var(--text-muted);
  box-shadow: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-color);
    border-color: var(--text-muted);
    color: var(--text-main);
  }
`;

const EmptyText = styled.p`
  font-size: 0.88rem;
  color: var(--text-muted);
  text-align: center;
  margin: 16px 0;
`;

const LONGDO_MAP_API_KEY = "dce991552aa3be08c5d05dc9b1a852fc";

export default function LocationModal({ onClose }) {
  const { data: locations, isLoading: isFetching } = SelectLocation();
  const mapContainerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);

  // 1. Load Longdo Map SDK dynamically
  useEffect(() => {
    const existingScript = document.getElementById("longdo-map-sdk");

    const checkNamespace = () => {
      if (window.longdo) {
        setSdkReady(true);
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "longdo-map-sdk";
      script.src = `https://api.longdo.com/map/?key=${LONGDO_MAP_API_KEY}`;
      script.async = true;
      script.onload = () => {
        const interval = setInterval(() => {
          if (window.longdo) {
            clearInterval(interval);
            checkNamespace();
          }
        }, 100);
      };
      document.head.appendChild(script);
    } else {
      checkNamespace();
    }
  }, []);

  // 2. Initialize map and markers when SDK and locations are ready
  useEffect(() => {
    if (!sdkReady || !mapContainerRef.current || !locations || locations.length === 0) return;

    // Clear previous renders (especially helpful during Hot Reload)
    mapContainerRef.current.innerHTML = "";

    // Create map object
    const map = new window.longdo.Map({
      placeholder: mapContainerRef.current
    });

    // Configure default center & zoom
    const defaultCenter = {
      lon: Number(locations[0].lng),
      lat: Number(locations[0].lat)
    };

    // Zoom level 14 is suitable for city branch viewing
    map.zoom(14, true);
    map.location(defaultCenter, true);

    // Plot all branches
    locations.forEach((loc) => {
      const marker = new window.longdo.Marker(
        { lon: Number(loc.lng), lat: Number(loc.lat) },
        {
          title: loc.name,
          detail: loc.name
        }
      );
      map.Overlays.add(marker);
    });

  }, [sdkReady, locations]);

  return (
    <div>
      <Title>📍 ที่อยู่ร้าน</Title>

      <ShopImageWrapper>
        <ShopImage 
          src="https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/712743753_122096902683356869_4747625473668014500_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1409&ctp=s2048x1409&_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=66QgLrdCa0sQ7kNvwE2wivW&_nc_oc=AdrccXukZSO1_9fFCOI_hgS7UekaCo8qU3oq4OgOeTAF74yxnAYTLYFEVaqlCGC2WLDLhAhJ1Ee_rlVa_NQxj75P&_nc_zt=23&_nc_ht=scontent.fbkk12-1.fna&_nc_gid=O2bFUEwf7AkVoQvy9roarA&_nc_ss=7b2a8&oh=00_AQCmlB40EldkLEhyAIvFYdJwVH6jzUqR09aEaqUoVeOWHg&oe=6A529AD2" 
          alt="SunBabe Shop storefront" 
        />
      </ShopImageWrapper>

      {isFetching ? (
        <MapWrapper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <EmptyText>กำลังดึงข้อมูลพิกัดแผนที่... 🌸</EmptyText>
        </MapWrapper>
      ) : !locations || locations.length === 0 ? (
        <MapWrapper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <EmptyText>ขออภัย ยังไม่มีการบันทึกสาขาพิกัดที่ตั้งร้าน 🥺</EmptyText>
        </MapWrapper>
      ) : (
        <MapWrapper ref={mapContainerRef} />
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <CancelButton onClick={onClose} style={{ width: '100%' }}>
          ❌ ปิดแผนที่
        </CancelButton>
      </div>
    </div>
  );
}

LocationModal.propTypes = {
  onClose: PropTypes.func.isRequired
};
