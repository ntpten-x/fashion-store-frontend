import CategoryTable from "../components/category/CategoryTable"
import CategoryForm from "../components/category/CategoryForm"
import { useState } from "react"
import styled, { keyframes } from "styled-components"

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleUp = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeIn} 0.4s ease-out;
  padding-bottom: 30px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const HeaderText = styled.div`
  text-align: left;
  h1 {
    font-family: "Fredoka", sans-serif;
    font-size: 1.8rem;
    color: var(--text-main);
    margin: 0;
  }
  p {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 4px 0 0 0;
  }
`;

const ActionButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 10px 24px;
  font-size: 0.95rem;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
  }
`;

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
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: var(--panel-bg);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  padding: 32px;
  width: 90%;
  max-width: 520px;
  position: relative;
  animation: ${scaleUp} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 480px) {
    padding: 24px;
  }
`;

const CloseIconButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  box-shadow: none;
  padding: 8px;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--bg-color);
    color: var(--text-main);
    transform: rotate(90deg);
  }
`;

export default function Category() {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [category, setCategory] = useState(null)

  function handleOpenFormAdd() {
    setIsOpenForm(true)
  }

  function handleCloseFormAdd() {
    setIsOpenForm(false)
    setCategory(null)
  }

  function handleEdit(cat) {
    setCategory(cat)
    setIsOpenForm(true)
  }

  return (
    <Container>
      <HeaderSection>
        <HeaderText>
          <h1>จัดการหมวดหมู่สินค้า 🏷️</h1>
        </HeaderText>

        <ActionButton onClick={handleOpenFormAdd}>
          <span>เพิ่มหมวดหมู่</span>
        </ActionButton>
      </HeaderSection>

      {isOpenForm && (
        <ModalOverlay onClick={handleCloseFormAdd}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseIconButton onClick={handleCloseFormAdd}>
              ✕
            </CloseIconButton>
            <CategoryForm
              isOpenForm={isOpenForm}
              setIsOpenForm={setIsOpenForm}
              category={category}
              onClose={handleCloseFormAdd}
            />
          </ModalContent>
        </ModalOverlay>
      )}

      <CategoryTable onCategory={handleEdit} />
    </Container>
  )
}
