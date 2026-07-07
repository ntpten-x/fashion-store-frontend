import styled from "styled-components";
import { useState, useEffect } from "react";
import RowCard from "../../ui/RowCard";
import { SelectProduct } from "../../services/apiProduct";
import { SelectCategory } from "../../services/apiCategory";
import { SelectColors } from "../../services/apiColors";
import { SelectSizes } from "../../services/apiSize";
import { usePagination } from "../paginations/usePagination";
import Pagination from "../paginations/Pagination";

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
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;

  ${props => props.$image && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url(${props.$image});
      background-size: cover;
      background-position: center;
      filter: blur(15px) brightness(0.95);
      opacity: 0.2;
      z-index: 1;
    }
  `}

  img {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    z-index: 2;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
  }
  
  .emoji {
    font-size: 5rem;
    position: relative;
    z-index: 2;
  }

  @media (max-width: 680px) {
    height: 260px;
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

const FilterTriggerButton = styled.button`
  background: var(--panel-bg);
  border: 1.5px solid var(--primary-color);
  border-radius: 99px;
  padding: 8px 18px;
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--primary-hover);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 10px rgba(255, 158, 187, 0.06);
  
  &:hover {
    border-color: var(--primary-hover);
    background-color: var(--primary-light);
    color: var(--primary-hover);
    transform: translateY(-1.5px);
    box-shadow: 0 6px 14px rgba(255, 158, 187, 0.12);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .badge {
    background-color: var(--primary-color);
    color: white;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 99px;
    margin-left: 2px;
  }
`;

const ActiveFilterTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin-top: 8px;
`;

const ActiveTag = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 99px;
  font-family: "Fredoka", sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;
  
  background-color: ${props => {
    if (props.$type === 'category') return 'var(--primary-light)';
    if (props.$type === 'color') return 'var(--secondary-light)';
    return '#f3e8ff'; // size
  }};
  
  border: 1px solid ${props => {
    if (props.$type === 'category') return 'rgba(255, 158, 187, 0.4)';
    if (props.$type === 'color') return 'rgba(162, 210, 255, 0.4)';
    return 'rgba(216, 180, 254, 0.5)'; // size
  }};
  
  color: ${props => {
    if (props.$type === 'category') return 'var(--primary-hover)';
    if (props.$type === 'color') return 'var(--secondary-hover)';
    return '#a855f7'; // size
  }};
  
  &:hover {
    transform: translateY(-1.5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.02);
    filter: brightness(0.97);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .close-icon {
    font-size: 0.7rem;
    margin-left: 2px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  &:hover .close-icon {
    opacity: 1;
  }
`;

const FilterModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(61, 74, 92, 0.25);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10100;
  animation: fadeInModal 0.2s ease-out;
`;

const FilterModalContent = styled.div`
  background-color: var(--panel-bg);
  border-radius: 28px;
  border: 1.5px solid var(--border-color);
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(162, 210, 255, 0.15);
  animation: scaleUpModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  box-sizing: border-box;
  max-height: 85vh;
  overflow-y: auto;
`;

const FilterModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1.5px dashed var(--border-color);
  padding-bottom: 12px;
  
  h3 {
    font-family: "Fredoka", sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-main);
    margin: 0;
  }
`;

const FilterModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FilterModalFooter = styled.div`
  display: flex;
  gap: 12px;
  border-top: 1.5px dashed var(--border-color);
  padding-top: 16px;
  margin-top: 4px;
`;

const ApplyFiltersButton = styled.button`
  flex: 1.5;
  padding: 10px 20px;
  border-radius: 99px;
  font-family: "Fredoka", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(255, 111, 145, 0.2);
    transform: translateY(-1.5px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FilterSectionTitle = styled.h4`
  font-family: "Fredoka", sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const CategoryPillsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 8px;
  width: 100%;
`;

const CategoryPill = styled.button`
  padding: 8px 10px;
  border-radius: 99px;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: "Fredoka", sans-serif;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.2);
  box-shadow: none;
  border: 1px solid ${props => props.$active ? 'transparent' : 'var(--border-color)'};
  background: ${props => props.$active
    ? 'linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)'
    : 'var(--bg-color)'};
  color: ${props => props.$active ? 'white' : 'var(--text-main)'};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  
  &:hover {
    transform: translateY(-1.5px);
    background: ${props => props.$active
    ? 'linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)'
    : 'var(--primary-light)'};
    border-color: ${props => props.$active ? 'transparent' : 'var(--primary-color)'};
    color: ${props => props.$active ? 'white' : 'var(--primary-hover)'};
  }
`;

const FilterSelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const FilterSelectLabel = styled.span`
  font-family: "Fredoka", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 32px 10px 16px;
  border-radius: 99px;
  border: 1.5px solid var(--border-color);
  background-color: var(--bg-color);
  font-family: "Fredoka", sans-serif;
  font-size: 0.88rem;
  color: var(--text-main);
  transition: all 0.2s ease;
  cursor: pointer;
  outline: none;
  
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237d8f9f' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 14px;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-light);
    background-color: white;
  }
`;

const ClearFilterButton = styled.button`
  padding: 8px 18px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 500;
  font-family: "Fredoka", sans-serif;
  background-color: transparent;
  border: 1.5px dashed #ff6b8b;
  color: #ff6b8b;
  box-shadow: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #ffe3e9;
    color: #ff4770;
    border-color: #ff4770;
    transform: translateY(-2.0px);
  }
`;

export default function ProductRowCard() {
  const limit = 12;
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterSize, setFilterSize] = useState("");

  const { data: categories } = SelectCategory();
  const { data: colors } = SelectColors();
  const { data: sizes } = SelectSizes();

  const { data: allProductsData } = SelectProduct({ limit: 1000, is_use: true });

  const productsArray = Array.isArray(allProductsData) 
    ? allProductsData 
    : allProductsData?.data || [];

  const activeCategories = new Set(
    productsArray.map((p) => p.category).filter(Boolean)
  );
  const activeColors = new Set(
    productsArray.map((p) => p.color).filter(Boolean)
  );
  const activeSizes = new Set(
    productsArray.map((p) => p.size).filter(Boolean)
  );

  const showAllCategories = activeCategories.size === 0;
  const showAllColors = activeColors.size === 0;
  const showAllSizes = activeSizes.size === 0;

  const { isLoading, data } = SelectProduct({
    page,
    limit,
    is_use: true,
    ...(filterCategory && { category: filterCategory }),
    ...(filterColor && { color: filterColor }),
    ...(filterSize && { size: filterSize })
  });

  const total = data?.total || 0;

  const { totalPages, getPageNumbers } = usePagination({
    page,
    setPage,
    total,
    limit,
    sectionId: "products-section"
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filterCategory, filterColor, filterSize]);

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

  // Close filter modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsFilterModalOpen(false);
      }
    };
    if (isFilterModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFilterModalOpen]);

  const handleClearAllFilters = () => {
    setFilterCategory("");
    setFilterColor("");
    setFilterSize("");
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <span className="spinner">☁️</span>
        <p>กำลังโหลด...</p>
      </LoadingContainer>
    );
  }

  const displayProducts = data?.data || [];

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

  const activeFiltersCount = [filterCategory, filterColor, filterSize].filter(Boolean).length;

  return (
    <Container id="products-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <SectionHeader style={{ marginTop: 0 }}>
          <h2>สินค้า 🛍️</h2>
        </SectionHeader>

        <FilterTriggerButton onClick={() => setIsFilterModalOpen(true)}>
          🔍 ค้นหา
          {activeFiltersCount > 0 && <span className="badge">{activeFiltersCount}</span>}
        </FilterTriggerButton>
      </div>

      {activeFiltersCount > 0 && (
        <ActiveFilterTagsRow>
          {filterCategory && (
            <ActiveTag onClick={() => setFilterCategory("")}>
              {getCategoryEmoji(filterCategory)} {filterCategory} <span className="close-icon">✕</span>
            </ActiveTag>
          )}
          {filterColor && (
            <ActiveTag onClick={() => setFilterColor("")}>
              🎨 {filterColor} <span className="close-icon">✕</span>
            </ActiveTag>
          )}
          {filterSize && (
            <ActiveTag onClick={() => setFilterSize("")}>
              📏 {filterSize} <span className="close-icon">✕</span>
            </ActiveTag>
          )}
          <ActiveTag
            onClick={handleClearAllFilters}
            style={{
              backgroundColor: 'transparent',
              borderStyle: 'dashed',
              borderColor: '#ff6b8b',
              color: '#ff6b8b'
            }}
          >
            ล้างทั้งหมด 🧹
          </ActiveTag>
        </ActiveFilterTagsRow>
      )}

      {displayProducts.length === 0 ? (
        <NoDataContainer style={{ marginTop: '16px' }}>
          <span className="emoji">🔍</span>
          <p>ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหาของคุณ</p>
          {(filterCategory || filterColor || filterSize) && (
            <ClearFilterButton onClick={handleClearAllFilters} style={{ borderStyle: 'solid', marginTop: '10px' }}>
              ล้างตัวกรองทั้งหมด
            </ClearFilterButton>
          )}
        </NoDataContainer>
      ) : (
        <>
          <ProductGrid style={{ marginTop: '10px' }}>
            {displayProducts.map((product) => (
              <RowCard
                key={product.id}
                product={product}
                onViewMore={handleViewMore}
              />
            ))}
          </ProductGrid>

          <Pagination
            page={page}
            totalPages={totalPages}
            getPageNumbers={getPageNumbers}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Filter Options Modal */}
      {isFilterModalOpen && (
        <FilterModalOverlay onClick={() => setIsFilterModalOpen(false)}>
          <FilterModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsFilterModalOpen(false)}>✕</CloseButton>

            <FilterModalHeader>
              <div>
                <h3>🔍 ค้นหา</h3>
              </div>
            </FilterModalHeader>

            <FilterModalBody>
              <div>
                <FilterSectionTitle style={{ marginBottom: '10px' }}>หมวดหมู่สินค้า</FilterSectionTitle>
                <CategoryPillsRow>
                  <CategoryPill
                    $active={filterCategory === ""}
                    onClick={() => setFilterCategory("")}
                  >
                    <strong>ทั้งหมด 🛍️</strong>
                  </CategoryPill>
                  {categories?.filter(cat => showAllCategories || activeCategories.has(cat.category_name)).map((cat) => (
                    <CategoryPill
                      key={cat.id}
                      $active={filterCategory === cat.category_name}
                      onClick={() => setFilterCategory(cat.category_name)}
                    >
                      {getCategoryEmoji(cat.category_name)} {cat.category_name}
                    </CategoryPill>
                  ))}
                </CategoryPillsRow>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1.5px dashed var(--border-color)', paddingTop: '16px' }}>
                <FilterSelectGroup>
                  <FilterSelectLabel>🎨 เลือกสีสินค้า</FilterSelectLabel>
                  <FilterSelect
                    value={filterColor}
                    onChange={(e) => setFilterColor(e.target.value)}
                  >
                    <option value="">ทั้งหมด</option>
                    {colors?.filter(col => showAllColors || activeColors.has(col.colors_name)).map((col) => (
                      <option key={col.id} value={col.colors_name}>
                        {col.colors_name}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterSelectGroup>

                <FilterSelectGroup>
                  <FilterSelectLabel>📏 เลือกไซส์สินค้า</FilterSelectLabel>
                  <FilterSelect
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value)}
                  >
                    <option value="">ทั้งหมด</option>
                    {sizes?.filter(sz => showAllSizes || activeSizes.has(sz.size_name)).map((sz) => (
                      <option key={sz.id} value={sz.size_name}>
                        {sz.size_name}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterSelectGroup>
              </div>
            </FilterModalBody>

            <FilterModalFooter>
              <ClearFilterButton
                onClick={() => {
                  handleClearAllFilters();
                  setIsFilterModalOpen(false);
                }}
                style={{ flex: 1 }}
              >
                ล้างทั้งหมด
              </ClearFilterButton>
              <ApplyFiltersButton onClick={() => setIsFilterModalOpen(false)}>
                ตกลง ({total} รายการ)
              </ApplyFiltersButton>
            </FilterModalFooter>
          </FilterModalContent>
        </FilterModalOverlay>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={(e) => { e.stopPropagation(); handleCloseModal(); }}>✕</CloseButton>

            <ModalImageWrapper $image={selectedProduct.image}>
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
              <ModalDescription>{selectedProduct.description || ""}</ModalDescription>

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

