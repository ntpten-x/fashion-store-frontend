import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
import { DeleteCategory, SelectCategory } from "../../services/apiCategory"
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

export default function CategoryTable({ onCategory }) {
  const [page, setPage] = useState(1);
  const limit = 8;
  const { isLoading, data, error } = SelectCategory({ page, limit });
  const total = data?.total || 0;

  const { totalPages, getPageNumbers } = usePaginaions({ 
    page,
    setPage,
    total, 
    limit, 
    sectionId: "category-table-section" 
  });

  const categories = data?.data || [];
  const { mutate: deleteCategory, isLoading: isDeleting } = DeleteCategory()
  const toast = useToast()
  const [deletingCategory, setDeletingCategory] = useState(null)

  const handleDeleteClick = (cat) => {
    setDeletingCategory(cat)
  }

  const executeDelete = () => {
    if (!deletingCategory) return

    deleteCategory(deletingCategory.id, {
      onSuccess: () => {
        toast.success(`ลบหมวดหมู่ "${deletingCategory.category_name}" เรียบร้อยแล้ว 🗑️🌸`)
        setDeletingCategory(null)
      },
      onError: (err) => {
        toast.error(`ลบไม่สำเร็จ: ${err.message}`)
        setDeletingCategory(null)
      }
    })
  }

  if (isLoading) {
    return (
      <TableContainer>
        <TableMessage>กำลังโหลดข้อมูลหมวดหมู่... 🌸</TableMessage>
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

  if (!categories || categories.length === 0) {
    return (
      <TableContainer>
        <TableMessage>ยังไม่มีข้อมูลหมวดหมู่สินค้าในระบบ 🏷️</TableMessage>
      </TableContainer>
    )
  }

  return (
    <>
      <TableContainer id="category-table-section">
        <StyledTable>
          <thead>
            <tr>
              <Th style={{ width: "70%" }}>ชื่อหมวดหมู่</Th>
              <Th style={{ width: "30%" }}>การจัดการ</Th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <Tr key={category.id}>
                <Td>{category.category_name}</Td>
                <Td className="actions">
                  <EditButton onClick={() => onCategory(category)}>
                    ✏️ แก้ไข
                  </EditButton>
                  <DeleteButton
                    disabled={isDeleting}
                    onClick={() => handleDeleteClick(category)}
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
      {deletingCategory && (
        <ModalOverlay onClick={() => setDeletingCategory(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ConfirmTitle>🗑️ ยืนยันการลบหมวดหมู่</ConfirmTitle>
            <ConfirmBody>
              คุณต้องการลบหมวดหมู่ <strong>{`"${deletingCategory.category_name}"`}</strong> ใช่หรือไม่?

            </ConfirmBody>
            <ButtonRow>
              <CancelButton onClick={() => setDeletingCategory(null)}>
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

CategoryTable.propTypes = {
  onCategory: PropTypes.func.isRequired
}