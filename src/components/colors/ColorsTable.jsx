import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
import { DeleteColors, SelectColors } from "../../services/apiColors"
import { useToast } from "../../ui/Toast.jsx"
import { useState } from "react"
import { usePagination } from "../paginations/usePagination"
import Pagination from "../paginations/Pagination"

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
  
  @media (max-width: 768px) {
    background: transparent;
    border: none;
    box-shadow: none;
    overflow-x: visible;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    
    tbody {
      display: block;
      width: 100%;
    }
  }
`;

const Th = styled.th`
  background-color: #f7fafc;
  padding: 16px 24px;
  font-family: "Fredoka", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  border-bottom: 1.5px solid var(--border-color);
  
  @media (max-width: 768px) {
    display: none;
  }
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
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    display: block;
    width: 100% !important;
    padding: 10px 16px;
    border: none;
    box-sizing: border-box;
    
    &:first-child {
      padding-top: 16px;
      font-weight: 600;
      font-size: 1rem;
    }
    
    &:last-child {
      padding-bottom: 16px;
      border-top: 1px dashed var(--border-color);
      margin-top: 8px;
    }
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
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    background: var(--panel-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-sm);
    box-sizing: border-box;
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

// Color Preview Styles
const ColorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  
  .mobile-label {
    display: none;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    .mobile-label {
      display: inline;
    }
  }
`;

const ColorBadge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1.5px solid var(--border-color);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
  vertical-align: middle;
`;

const HexCode = styled.code`
  font-family: "Poppins", monospace;
  font-size: 0.88rem;
  background-color: var(--bg-color);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  color: var(--text-main);
`;

const SpecBadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  justify-content: center;
  
  .mobile-label {
    display: none;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
    align-self: center;
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start !important;
    
    .cat-badges-wrapper {
      justify-content: flex-start !important;
    }
    
    .mobile-label {
      display: inline;
    }
  }
`;

const UseCategoryBadge = styled.span`
  font-family: "Fredoka", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--secondary-hover);
  background-color: var(--secondary-light);
  padding: 3px 10px;
  border-radius: 99px;
  border: 0.5px solid var(--secondary-color);
`;

const NoCategoryBadge = styled.span`
  font-family: "Fredoka", sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-muted);
  background-color: var(--bg-color);
  padding: 3px 10px;
  border-radius: 99px;
  border: 1px dashed var(--border-color);
`;

export default function ColorsTable({ onColor }) {
  const [page, setPage] = useState(1);
  const limit = 8;
  const { isLoading, data, error } = SelectColors({ page, limit });
  const total = data?.total || 0;

  const { totalPages, getPageNumbers } = usePagination({ 
    page,
    setPage,
    total, 
    limit, 
    sectionId: "colors-table-section" 
  });

  const colors = data?.data || [];
  const { mutate: deleteColor, isLoading: isDeleting } = DeleteColors()
  const toast = useToast()
  const [deletingColor, setDeletingColor] = useState(null)

  const handleDeleteClick = (col) => {
    setDeletingColor(col)
  }

  const executeDelete = () => {
    if (!deletingColor) return

    deleteColor(deletingColor.id, {
      onSuccess: () => {
        toast.success(`ลบสี "${deletingColor.colors_name}" เรียบร้อยแล้ว 🗑️🎨`)
        setDeletingColor(null)
      },
      onError: (err) => {
        toast.error(`ลบไม่สำเร็จ: ${err.message}`)
        setDeletingColor(null)
      }
    })
  }

  if (isLoading) {
    return (
      <TableContainer>
        <TableMessage>กำลังโหลดข้อมูลสี... 🎨</TableMessage>
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

  if (!colors || colors.length === 0) {
    return (
      <TableContainer>
        <TableMessage>ยังไม่มีข้อมูลสีสินค้าในระบบ 🎨🏷️</TableMessage>
      </TableContainer>
    )
  }

  return (
    <>
      <TableContainer id="colors-table-section">
        <StyledTable>
          <thead>
            <tr>
              <Th style={{ width: "25%", textAlign: "center" }}>สี</Th>
              <Th style={{ width: "25%", textAlign: "center" }}>สีแสดงผล</Th>
              <Th style={{ width: "30%", textAlign: "center" }}>หมวดหมู่ที่ใช้งานได้</Th>
              <Th style={{ width: "20%", textAlign: "center" }}>การจัดการ</Th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <Tr key={color.id}>
                <Td style={{ textAlign: "center", fontWeight: "600" }}>{color.colors_name}</Td>
                <Td style={{ textAlign: "center" }}>
                  <ColorInfo>
                    <span className="mobile-label">สีแสดงผล:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <ColorBadge color={color.colors_code || '#cccccc'} />
                      <HexCode>{color.colors_code}</HexCode>
                    </div>
                  </ColorInfo>
                </Td>
                <Td style={{ textAlign: "center" }}>
                  <SpecBadgeRow>
                    <span className="mobile-label">หมวดหมู่:</span>
                    <div className="cat-badges-wrapper" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {color.use && color.use.length > 0 ? (
                        color.use.map(cat => (
                          <UseCategoryBadge key={cat.id}>{cat.category_name}</UseCategoryBadge>
                        ))
                      ) : (
                        <NoCategoryBadge>ทุกหมวดหมู่</NoCategoryBadge>
                      )}
                    </div>
                  </SpecBadgeRow>
                </Td>
                <Td className="actions">
                  <EditButton onClick={() => onColor(color)}>
                    ✏️ แก้ไข
                  </EditButton>
                  <DeleteButton
                    disabled={isDeleting}
                    onClick={() => handleDeleteClick(color)}
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
        <Pagination 
          page={page} 
          totalPages={totalPages} 
          getPageNumbers={getPageNumbers} 
          onPageChange={setPage} 
        />
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deletingColor && (
        <ModalOverlay onClick={() => setDeletingColor(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ConfirmTitle>🗑️ ยืนยันการลบสีสินค้า</ConfirmTitle>
            <ConfirmBody>
              คุณต้องการลบสี <strong>{`"${deletingColor.colors_name}"`}</strong> ใช่หรือไม่?

            </ConfirmBody>
            <ButtonRow>
              <CancelButton onClick={() => setDeletingColor(null)}>
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

ColorsTable.propTypes = {
  onColor: PropTypes.func.isRequired
}
