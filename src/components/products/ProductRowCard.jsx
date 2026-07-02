import styled from "styled-components";
import { useState, useEffect } from "react";
import RowCard from "../../ui/RowCard";
import { SelectProduct } from "../../services/apiProduct";
import { usePaginaions } from "../paginations/usePaginaions";
import Paginaiontion from "../paginations/Paginaiontion";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0 30px 0;
  gap: 20px;
  border-top: 1.5px dashed var(--border-color);
  margin-top: 16px;
`;

const SectionHeader = styled.div`
  text-align: left;
  margin-top: 10px;

  h2 {
    font-family: "Fredoka", sans-serif;
    font-size: 1.6rem;
    color: var(--text-main);
    margin: 0 0 4px 0;
    
    span {
      background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  p {
    font-size: 0.88rem;
    color: var(--text-muted);
    margin: 0;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  
  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (max-width: 360px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 12px;
  width: 100%;

  .spinner {
    font-size: 2.5rem;
    animation: bounce 1s ease-in-out infinite alternate;
  }

  p {
    font-family: "Fredoka", sans-serif;
    color: var(--text-muted);
    font-size: 0.95rem;
    margin: 0;
  }

  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-8px); }
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

export default function ProductRowCard() {
  const limit = 12;
  const [page, setPage] = useState(1);
  const { isLoading, data } = SelectProduct({ page, limit, is_use: true });
  const total = data?.total || 0;

  const { totalPages, getPageNumbers } = usePaginaions({ 
    page,
    setPage,
    total, 
    limit, 
    sectionId: "products-section" 
  });
  
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

  if (isLoading) {
    return (
      <LoadingContainer>
        <span className="spinner">☁️</span>
        <p>กำลังโหลด...</p>
      </LoadingContainer>
    );
  }

  const displayProducts = data?.data || [];

  if (displayProducts.length === 0) {
    return (
      <Container id="products-section">
        <SectionHeader>
          <h2>สินค้า 🛍️</h2>
        </SectionHeader>
        <NoDataContainer>
          <span className="emoji">📦</span>
          <p>ไม่มีข้อมูลสินค้าในขณะนี้</p>
        </NoDataContainer>
      </Container>
    );
  }

  const handleViewMore = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

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
    <Container id="products-section">
      <SectionHeader>
        <h2>สินค้า 🛍️</h2>
      </SectionHeader>

      <ProductGrid>
        {displayProducts.map((product) => (
          <RowCard
            key={product.id}
            product={product}
            onViewMore={handleViewMore}
          />
        ))}
      </ProductGrid>

      <Paginaiontion 
        page={page} 
        totalPages={totalPages} 
        getPageNumbers={getPageNumbers} 
        onPageChange={setPage} 
      />

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
                  {selectedProduct.color && <ModalSpecBadge>สี{selectedProduct.color}</ModalSpecBadge>}
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

