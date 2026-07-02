import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
import { DeleteProduct, SelectProduct } from "../../services/apiProduct"
import { useToast } from "../../ui/Toast.jsx"
import { useState } from "react"
import { usePaginaions } from "../paginations/usePaginaions"
import Paginaiontion from "../paginations/Paginaiontion"

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleUp = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const TableContainer = styled.div`
  background: var(--panel-bg);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  background-color: #f7fafc;
  padding: 16px 24px;
  font-family: "Fredoka", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  border-bottom: 1.5px solid var(--border-color);
`;

const Td = styled.td`
  padding: 16px 24px;
  font-size: 0.9rem;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
  
  &.actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
`;

const Tr = styled.tr`
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--primary-light);
  }
  
  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const TableMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
  font-family: "Fredoka", sans-serif;
  font-size: 1rem;
`;

const EditButton = styled.button`
  padding: 6px 14px;
  font-size: 0.8rem;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 8px;
  box-shadow: none;
  
  &:hover {
    background-color: var(--secondary-hover);
    transform: translateY(-1px);
  }
`;

const DeleteButton = styled.button`
  padding: 6px 14px;
  font-size: 0.8rem;
  background-color: #ffe3e9;
  color: #ff6b8b;
  border-radius: 8px;
  box-shadow: none;
  
  &:hover {
    background-color: #ffcbd6;
    color: #ff4770;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Modal Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(61, 74, 92, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: var(--panel-bg);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  padding: 32px;
  width: 90%;
  max-width: 450px;
  animation: ${scaleUp} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ConfirmTitle = styled.h3`
  font-family: "Fredoka", sans-serif;
  font-size: 1.2rem;
  color: var(--text-main);
  margin: 0;
`;

const ConfirmBody = styled.p`
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
  
  strong {
    color: var(--text-main);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  padding: 8px 20px;
  font-size: 0.88rem;
  background-color: transparent;
  border: 1.5px solid var(--border-color);
  color: var(--text-muted);
  border-radius: 10px;
  box-shadow: none;
  
  &:hover {
    background-color: var(--bg-color);
    border-color: var(--text-muted);
    color: var(--text-main);
    transform: translateY(-1px);
  }
`;

const ActionDeleteButton = styled.button`
  padding: 8px 20px;
  font-size: 0.88rem;
  background-color: #ff6b8b;
  color: white;
  border-radius: 10px;
  
  &:hover {
    background-color: #ff4770;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Product cell styled components
const ProductInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProductThumbnail = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .emoji {
    font-size: 1.5rem;
  }
`;

const NameStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductNameText = styled.span`
  font-weight: 500;
  color: var(--text-main);
`;

const ProductCategoryLabel = styled.span`
  font-family: "Fredoka", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--secondary-hover);
  background-color: var(--secondary-light);
  padding: 2px 8px;
  border-radius: 99px;
  align-self: flex-start;
  border: 0.5px solid var(--secondary-color);
`;

const StatusBadge = styled.span`
  font-family: "Fredoka", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  &.active {
    color: #2ec4b6;
    background-color: #e6fffa;
    border: 0.5px solid #2ec4b6;
  }
  
  &.inactive {
    color: #ff6b6b;
    background-color: #fff0f0;
    border: 0.5px solid #ff8585;
  }
`;

const PopularBadge = styled.span`
  font-family: "Fredoka", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #ff9f1c;
  background-color: #fff9e6;
  border: 0.5px solid #ff9f1c;
`;

const ProductPriceText = styled.span`
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  color: var(--primary-hover);
`;

const SpecBadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SpecBadge = styled.span`
  background-color: var(--bg-color);
  color: var(--text-muted);
  border: 1.5px solid var(--border-color);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 500;
`;

export default function ProductsTable({ onProduct }) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { isLoading, data, error } = SelectProduct({ page, limit });
  const total = data?.total || 0;

  const { totalPages, getPageNumbers } = usePaginaions({ 
    page,
    setPage,
    total, 
    limit, 
    sectionId: "products-table-section" 
  });

  const products = data?.data || [];
  const { mutate: deleteProduct, isLoading: isDeleting } = DeleteProduct()
  const toast = useToast()
  const [deletingProduct, setDeletingProduct] = useState(null)

  const handleDeleteClick = (prod) => {
    setDeletingProduct(prod)
  }

  const executeDelete = () => {
    if (!deletingProduct) return

    deleteProduct(deletingProduct.id, {
      onSuccess: () => {
        toast.success(`ลบสินค้า "${deletingProduct.name}" เรียบร้อยแล้ว 🗑️🌸`)
        setDeletingProduct(null)
      },
      onError: (err) => {
        toast.error(`ลบไม่สำเร็จ: ${err.message}`)
        setDeletingProduct(null)
      }
    })
  }

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

  if (isLoading) {
    return (
      <TableContainer>
        <TableMessage>กำลังโหลดข้อมูลสินค้า... ☁️</TableMessage>
      </TableContainer>
    )
  }

  if (error) {
    return (
      <TableContainer>
        <TableMessage>เกิดข้อผิดพลาด: {error.message} 🥺</TableMessage>
      </TableContainer>
    )
  }

  if (!products || products.length === 0) {
    return (
      <TableContainer>
        <TableMessage>ยังไม่มีข้อมูลสินค้าในระบบ 📦🏷️</TableMessage>
      </TableContainer>
    )
  }

  return (
    <>
      <TableContainer id="products-table-section">
        <StyledTable>
          <thead>
            <tr>
              <Th style={{ width: "45%" }}>ข้อมูลสินค้า</Th>
              <Th style={{ width: "20%" }}>ราคา</Th>
              <Th style={{ width: "20%" }}>คุณลักษณะ (Specs)</Th>
              <Th style={{ width: "15%" }}>การจัดการ</Th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <ProductInfoCell>
                    <ProductThumbnail>
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <span className="emoji">{getCategoryEmoji(product.category)}</span>
                      )}
                    </ProductThumbnail>
                    <NameStack>
                      <ProductNameText>{product.name}</ProductNameText>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {product.category && (
                          <ProductCategoryLabel>{product.category}</ProductCategoryLabel>
                        )}
                        <StatusBadge className={product.is_use !== false ? 'active' : 'inactive'}>
                          {product.is_use !== false ? '🟢 แสดงอยู่' : '🔴 ซ่อนอยู่'}
                        </StatusBadge>
                        {product.is_popular === true && (
                          <PopularBadge>⭐ ยอดนิยม</PopularBadge>
                        )}
                      </div>
                    </NameStack>
                  </ProductInfoCell>
                </Td>
                <Td>
                  <ProductPriceText>
                    ฿{Number(product.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </ProductPriceText>
                </Td>
                <Td>
                  <SpecBadgeRow>
                    {product.color && <SpecBadge>🎨 {product.color}</SpecBadge>}
                    {product.size && <SpecBadge>📏 {product.size}</SpecBadge>}
                  </SpecBadgeRow>
                </Td>
                <Td className="actions">
                  <EditButton onClick={() => onProduct(product)}>
                    ✏️ แก้ไข
                  </EditButton>
                  <DeleteButton
                    disabled={isDeleting}
                    onClick={() => handleDeleteClick(product)}
                  >
                    🗑️ ลบ
                  </DeleteButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      <div style={{ marginTop: '10px' }}>
        <Paginaiontion 
          page={page} 
          totalPages={totalPages} 
          getPageNumbers={getPageNumbers} 
          onPageChange={setPage} 
        />
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deletingProduct && (
        <ModalOverlay onClick={() => setDeletingProduct(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ConfirmTitle>🗑️ ยืนยันการลบข้อมูลสินค้า</ConfirmTitle>
            <ConfirmBody>
              คุณต้องการลบสินค้า <strong>{`"${deletingProduct.name}"`}</strong> ใช่หรือไม่?
            </ConfirmBody>
            <ButtonRow>
              <CancelButton onClick={() => setDeletingProduct(null)}>
                ยกเลิก
              </CancelButton>
              <ActionDeleteButton onClick={executeDelete} disabled={isDeleting}>
                {isDeleting ? 'กำลังลบ...' : 'ยืนยันการลบ'}
              </ActionDeleteButton>
            </ButtonRow>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  )
}

ProductsTable.propTypes = {
  onProduct: PropTypes.func.isRequired
}
