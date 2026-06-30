import { useForm } from "react-hook-form"
import { InsertCategory, UpdateCategory } from "../../services/apiCategory"
import { useToast } from "../../ui/Toast.jsx"
import PropTypes from "prop-types"
import { useEffect } from "react"
import styled from "styled-components"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
`;

const FormHeader = styled.h3`
  font-family: "Fredoka", sans-serif;
  font-size: 1.15rem;
  color: var(--text-main);
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-family: "Fredoka", sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-main);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background-color: var(--bg-color);
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    background-color: #ffffff;
    box-shadow: 0 0 0 4px var(--primary-light);
  }
`;

const ErrorMsg = styled.span`
  font-size: 0.8rem;
  color: #ff6b6b;
  margin-top: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const SubmitButton = styled.button`
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 0.9rem;
  background-color: var(--primary-color);
  color: white;
  
  &:hover {
    background-color: var(--primary-hover);
  }
  t
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled.button`
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 0.9rem;
  background-color: transparent;
  border: 1.5px solid var(--border-color);
  color: var(--text-muted);
  box-shadow: none;
  
  &:hover {
    background-color: var(--bg-color);
    border-color: var(--text-muted);
    color: var(--text-main);
    transform: translateY(-1px);
  }
`;

export default function CategoryForm({ isOpenForm, setIsOpenForm, category, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const isSessionCategory = Boolean(category?.id)
  const { mutate: createCategory, isLoading: isCreating } = InsertCategory()
  const { mutate: updateCategory, isLoading: isUpdating } = UpdateCategory()
  const toast = useToast()

  useEffect(() => {
    if (isOpenForm) {
      reset(category)
    } else {
      reset({ category_name: '' })
    }
  }, [isOpenForm, reset, category])

  const onSubmit = (data) => {
    const payload = {
      category_name: data.category_name
    }

    if (isSessionCategory) {
      updateCategory({ id: category.id, data: payload }, {
        onSuccess: () => {
          toast.success('อัปเดตข้อมูลหมวดหมู่เรียบร้อยแล้ว 🌸✨')
          reset()
          setIsOpenForm(false)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    } else {
      createCategory(payload, {
        onSuccess: () => {
          toast.success('บันทึกหมวดหมู่ใหม่เรียบร้อยแล้ว 🎉🌸')
          reset()
          setIsOpenForm(false)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>
        {isSessionCategory ? "✏️ แก้ไขข้อมูลหมวดหมู่สินค้า" : "➕ เพิ่มหมวดหมู่สินค้าใหม่"}
      </FormHeader>

      <InputGroup>
        <Label htmlFor="category_name">ชื่อหมวดหมู่</Label>
        <Input
          type="text"
          id="category_name"
          {...register("category_name", { required: "กรุณากรอกชื่อหมวดหมู่" })}
        />
        {errors.category_name && <ErrorMsg>{errors.category_name.message}</ErrorMsg>}
      </InputGroup>

      <ButtonRow>
        <SubmitButton type="submit" disabled={isSessionCategory ? isUpdating : isCreating}>
          {isSessionCategory
            ? (isUpdating ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข')
            : (isCreating ? 'กำลังบันทึก...' : 'เพิ่มหมวดหมู่')
          }
        </SubmitButton>
        <CancelButton type="button" onClick={onClose}>
          ยกเลิก
        </CancelButton>
      </ButtonRow>
    </Form>
  )
}

CategoryForm.propTypes = {
  isOpenForm: PropTypes.bool.isRequired,
  setIsOpenForm: PropTypes.func.isRequired,
  category: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}
