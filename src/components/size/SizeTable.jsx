import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
import { DeleteSizes, SelectSizes } from "../../services/apiSize"
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

const SpecBadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
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

export default function SizeTable({ onSize }) {
  const [page, setPage] = useState(1);
  const limit = 8;
  const { isLoading, data, error } = SelectSizes({ page, limit });
  const total = data?.total || 0;

  const { totalPages, getPageNumbers } = usePaginaions({ 
    page,
    setPage,
    total, 
    limit, 
    sectionId: "size-table-section" 
  });

  const sizes = data?.data || [];
  const { mutate: deleteSize, isLoading: isDeleting } = DeleteSizes()
  const toast = useToast()
  const [deletingSize, setDeletingSize] = useState(null)

  const handleDeleteClick = (sz) => {
    setDeletingSize(sz)
  }

  const executeDelete = () => {
    if (!deletingSize) return

    deleteSize(deletingSize.id, {
      onSuccess: () => {
        toast.success(`ลบขนาด "${deletingSize.size_name}" เรียบร้อยแล้ว 🗑️📏`)
        setDeletingSize(null)
      },
      onError: (err) => {
        toast.error(`ลบไม่สำเร็จ: ${err.message}`)
        setDeletingSize(null)
      }
    })
  }

  if (isLoading) {
    return (
      <TableContainer>
        <TableMessage>กำลังโหลดข้อมูลขนาดสินค้า... 📏</TableMessage>
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

  if (!sizes || sizes.length === 0) {
    return (
      <TableContainer>
        <TableMessage>ยังไม่มีข้อมูลขนาดสินค้าในระบบ 📏🏷️</TableMessage>
      </TableContainer>
    )
  }

  return (
    <>
      <TableContainer id="size-table-section">
        <StyledTable>
          <thead>
            <tr>
              <Th style={{ width: "40%" }}>ขนาดสินค้า</Th>
              <Th style={{ width: "40%" }}>หมวดหมู่ที่ใช้งานได้</Th>
              <Th style={{ width: "20%" }}>การจัดการ</Th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((sz) => (
              <Tr key={sz.id}>
                <Td>{sz.size_name}</Td>
                <Td>
                  <SpecBadgeRow>
                    {sz.use && sz.use.length > 0 ? (
                      sz.use.map(cat => (
                        <UseCategoryBadge key={cat.id}>{cat.category_name}</UseCategoryBadge>
                      ))
                    ) : (
                      <NoCategoryBadge>ทุกหมวดหมู่</NoCategoryBadge>
                    )}
                  </SpecBadgeRow>
                </Td>
                <Td className="actions">
                  <EditButton onClick={() => onSize(sz)}>
                    ✏️ แก้ไข
                  </EditButton>
                  <DeleteButton
                    disabled={isDeleting}
                    onClick={() => handleDeleteClick(sz)}
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
      {deletingSize && (
        <ModalOverlay onClick={() => setDeletingSize(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ConfirmTitle>🗑️ ยืนยันการลบขนาดสินค้า</ConfirmTitle>
            <ConfirmBody>
              คุณต้องการลบขนาด <strong>{`"${deletingSize.size_name}"`}</strong> ใช่หรือไม่?

            </ConfirmBody>
            <ButtonRow>
              <CancelButton onClick={() => setDeletingSize(null)}>
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

SizeTable.propTypes = {
  onSize: PropTypes.func.isRequired
}
