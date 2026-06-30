import styled from "styled-components";
import { useState, useEffect } from "react";
import { useProducts } from "./useProducts";
import Card from "../../ui/Card";
// Using API-only products. Fallback mocks removed.

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px 0 20px 0;
  gap: 20px;
`;

const SectionHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 960px;
  margin-bottom: 12px;
  padding: 0 4px;
  align-self: center;
  gap: 8px;

  @media (max-width: 1024px) {
    padding: 0 30px;
  }
  @media (max-width: 768px) {
    padding: 0 40px;
  }
  @media (max-width: 480px) {
    padding: 0 36px;
  }
`;

const Title = styled.h2`
  font-family: "Fredoka", sans-serif;
  font-size: 1.9rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  span {
    background: linear-gradient(135deg, var(--primary-hover) 0%, var(--secondary-hover) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const DecorativeBadge = styled.span`
  background: var(--primary-light);
  color: var(--primary-hover);
  border: 1.5px solid var(--primary-color);
  padding: 4px 14px;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: "Fredoka", sans-serif;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow: var(--shadow-sm);
  animation: pulse 2s infinite ease-in-out;
  text-transform: uppercase;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: var(--panel-bg);
  border: 1.5px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--secondary-color);
  font-size: 1.25rem;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: var(--shadow-sm);
  padding: 0;
  z-index: 10;
  flex-shrink: 0;
  border: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  &.prev {
    left: -20px;
  }
  &.next {
    right: -20px;
  }

  &:hover:not(:disabled) {
    background-color: var(--secondary-light);
    border-color: var(--secondary-color);
    color: var(--secondary-hover);
    transform: translateY(-50%) scale(1.1);
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    color: var(--text-muted);
    border-color: var(--border-color);
  }

  @media (max-width: 1024px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    &.prev {
      left: -10px;
    }
    &.next {
      right: -10px;
    }
  }

  @media (max-width: 768px) {
    &.prev {
      left: 0px;
    }
    &.next {
      right: 0px;
    }
  }
`;

const Viewport = styled.div`
  overflow: hidden;
  width: 100%;
  max-width: 960px;
  padding: 10px 4px;

  @media (max-width: 1024px) {
    padding: 10px 30px;
  }
  @media (max-width: 768px) {
    padding: 10px 40px;
  }
  @media (max-width: 480px) {
    padding: 10px 36px;
  }
`;

const CardTrack = styled.div`
  display: flex;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  gap: 20px;
  transform: translateX(calc(-${props => props.$currentIndex} * (100% + 20px) / ${props => props.$itemsPerPage}));
`;

const Slide = styled.div`
  flex: 0 0 calc((100% - (${props => props.$itemsPerPage} - 1) * 20px) / ${props => props.$itemsPerPage});
  height: 100%;
  box-sizing: border-box;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 10px;
`;

const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$active ? 'var(--secondary-color)' : 'var(--border-color)'};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$active && `
    width: 20px;
    border-radius: 4px;
    background-color: var(--secondary-hover);
  `}

  &:hover {
    background-color: var(--secondary-hover);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 16px;
  width: 100%;

  .spinner {
    font-size: 3rem;
    animation: bounce 1s ease-in-out infinite alternate;
  }

  p {
    font-family: "Fredoka", sans-serif;
    color: var(--text-muted);
    font-size: 1rem;
    margin: 0;
  }

  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-12px); }
  }
`;

/* Detailed Modal Styles */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(61, 74, 92, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeInModal 0.25s ease-out;

  @keyframes fadeInModal {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background-color: var(--panel-bg);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  padding: 28px;
  width: 90%;
  max-width: 720px;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 28px;
  box-shadow: var(--shadow-lg);
  animation: scaleUpModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.15);
  position: relative;

  @keyframes scaleUpModal {
    from { transform: scale(0.9) translateY(20px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    max-height: 85vh;
    overflow-y: auto;
    gap: 16px;
    padding: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--bg-color);
  color: var(--text-muted);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  z-index: 10;
  padding: 0;

  &:hover {
    background-color: var(--primary-light);
    color: var(--primary-hover);
    transform: rotate(90deg);
  }
`;

const ModalImageWrapper = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .emoji {
    font-size: 5rem;
  }

  @media (max-width: 680px) {
    height: 200px;
  }
`;

const ModalDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
`;

const ModalCategory = styled.span`
  background-color: var(--secondary-light);
  color: var(--secondary-hover);
  border: 1px solid var(--secondary-color);
  padding: 3px 12px;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 600;
  align-self: flex-start;
  text-transform: uppercase;
  font-family: "Fredoka", sans-serif;
`;

const ModalTitle = styled.h2`
  font-family: "Fredoka", "Poppins", sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ModalPrice = styled.div`
  font-family: "Fredoka", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-hover);

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const ModalDescription = styled.p`
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0 0 10px 0;
`;

const ModalSpecs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  border-top: 1px dashed var(--border-color);
  padding-top: 12px;
`;

const ModalSpecBadge = styled.span`
  background-color: var(--bg-color);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: var(--panel-bg);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
  width: 100%;
  text-align: center;
  gap: 12px;
  box-sizing: border-box;

  .emoji {
    font-size: 2.5rem;
    animation: floatEmoji 4s ease-in-out infinite;
  }

  p {
    font-family: "Fredoka", sans-serif;
    color: var(--text-muted);
    font-size: 1rem;
    margin: 0;
  }

  @keyframes floatEmoji {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-6px) rotate(4deg); }
  }
`;

export default function ProductsCard() {
  const { isLoading, products } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
      }
    };
    if (selectedProduct) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  // Resize listener to adjust itemsPerPage dynamically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setItemsPerPage(1);
      } else if (window.innerWidth <= 900) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <span className="spinner">☁️</span>
        <p>กำลังโหลด......</p>
      </LoadingContainer>
    );
  }

  const displayProducts = (products || []).filter(p => p.is_use !== false && p.is_popular === true);

  if (displayProducts.length === 0) {
    return (
      <Container>
        <NoDataContainer style={{ margin: "20px 0" }}>
          <span className="emoji">📦</span>
          <p>ไม่มีข้อมูลสินค้าในขณะนี้</p>
        </NoDataContainer>
      </Container>
    );
  }

  // Carousel boundary math
  const maxIndex = Math.max(0, displayProducts.length - itemsPerPage);

  // Reset index if it exceeds boundaries after resizing
  if (currentIndex > maxIndex) {
    setCurrentIndex(maxIndex);
  }

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleViewMore = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Generate indicator dots count
  const dotsCount = maxIndex + 1;

  const getCategoryEmoji = (cat) => {
    const c = String(cat || "").toLowerCase();
    if (c.includes("shirt") || c.includes("cloth") || c.includes("top") || c.includes("เสื้อ")) return "👕";
    if (c.includes("pant") || c.includes("jean") || c.includes("กางเกง")) return "👖";
    if (c.includes("dress") || c.includes("กระโปรง")) return "👗";
    if (c.includes("shoe") || c.includes("รองเท้า")) return "👟";
    if (c.includes("hat") || c.includes("cap") || c.includes("หมวก")) return "🧢";
    if (c.includes("bag") || c.includes("กระเป๋า")) return "🎒";
    return "🎁";
  };

  return (
    <Container>
      <SectionHeader>
        <DecorativeBadge>POPULAR</DecorativeBadge>
        <Title>
          <span>สินค้ายอดนิยม</span>
        </Title>
      </SectionHeader>

      <CarouselWrapper>
        <NavButton className="prev" onClick={handlePrev} disabled={currentIndex === 0} aria-label="Previous slide">
          &lt;
        </NavButton>

        <Viewport id="carousel-viewport">
          <CardTrack $currentIndex={currentIndex} $itemsPerPage={itemsPerPage}>
            {displayProducts.map((product) => (
              <Slide
                key={product.id}
                $itemsPerPage={itemsPerPage}
              >
                <Card product={product} onViewMore={handleViewMore} />
              </Slide>
            ))}
          </CardTrack>
        </Viewport>

        <NavButton className="next" onClick={handleNext} disabled={currentIndex === maxIndex} aria-label="Next slide">
          &gt;
        </NavButton>
      </CarouselWrapper>

      {dotsCount > 1 && (
        <DotsContainer>
          {Array.from({ length: dotsCount }).map((_, i) => (
            <Dot
              key={i}
              $active={currentIndex === i}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </DotsContainer>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={(e) => { e.stopPropagation(); handleCloseModal(); }}>✕</CloseButton>

            <ModalImageWrapper>
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              ) : (
                <span className="emoji">{getCategoryEmoji(selectedProduct.category)}</span>
              )}
            </ModalImageWrapper>

            <ModalDetails>
              {selectedProduct.category && <ModalCategory>{selectedProduct.category}</ModalCategory>}
              <ModalTitle>{selectedProduct.name}</ModalTitle>
              <ModalPrice>฿{Number(selectedProduct.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</ModalPrice>
              <ModalDescription>{selectedProduct.description || "ไม่มีรายละเอียดสินค้าเพิ่มเติมสำหรับรายการนี้"}</ModalDescription>

              {(selectedProduct.color || selectedProduct.size) && (
                <ModalSpecs>
                  {selectedProduct.color && <ModalSpecBadge >สี{selectedProduct.color}</ModalSpecBadge>}
                  {selectedProduct.size && <ModalSpecBadge>ไซส์ {selectedProduct.size}</ModalSpecBadge>}
                </ModalSpecs>
              )}
            </ModalDetails>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}


