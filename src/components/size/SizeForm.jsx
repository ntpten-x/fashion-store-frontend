import { useForm } from "react-hook-form"
import { InsertSizes, UpdateSizes } from "../../services/apiSize"
import { SelectCategory } from "../../services/apiCategory"
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
  box-sizing: border-box;
  
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

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  background-color: var(--bg-color);
  padding: 12px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  max-height: 120px;
  overflow-y: auto;
  box-sizing: border-box;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-main);
  cursor: pointer;
  user-select: none;
  
  input {
    width: 16px;
    height: 16px;
    accent-color: var(--primary-color);
    cursor: pointer;
  }
`;

export default function SizeForm({ isOpenForm, setIsOpenForm, size, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const isSessionSize = Boolean(size?.id)
  const { mutate: createSize, isLoading: isCreating } = InsertSizes()
  const { mutate: updateSize, isLoading: isUpdating } = UpdateSizes()
  const toast = useToast()

  const { data: categories } = SelectCategory()

  useEffect(() => {
    if (isOpenForm) {
      reset({
        size_name: size?.size_name || '',
        categoryIds: size?.use?.map(cat => cat.id) || []
      })
    } else {
      reset({ size_name: '', categoryIds: [] })
    }
  }, [isOpenForm, reset, size])

  const onSubmit = (data) => {
    const payload = {
      size_name: data.size_name,
      categoryIds: data.categoryIds || []
    }

    if (isSessionSize) {
      updateSize({ id: size.id, data: payload }, {
        onSuccess: () => {
          toast.success('อัปเดตข้อมูลขนาดสินค้าเรียบร้อยแล้ว 📏✨')
          reset()
          setIsOpenForm(false)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    } else {
      createSize(payload, {
        onSuccess: () => {
          toast.success('บันทึกขนาดสินค้าใหม่เรียบร้อยแล้ว 🎉📏')
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
        {isSessionSize ? "✏️ แก้ไขข้อมูลขนาดสินค้า" : "➕ เพิ่มขนาดสินค้าใหม่"}
      </FormHeader>

      <InputGroup>
        <Label htmlFor="size_name">ขนาดสินค้า</Label>
        <Input
          type="text"
          id="size_name"
          {...register("size_name", { required: "กรุณากรอกขนาดสินค้า" })}
        />
        {errors.size_name && <ErrorMsg>{errors.size_name.message}</ErrorMsg>}
      </InputGroup>

      <InputGroup>
        <Label>หมวดหมู่สินค้าที่สามารถใช้ขนาดนี้ได้</Label>
        <CategoryGrid>
          {categories?.map((cat) => (
            <CheckboxLabel key={cat.id}>
              <input
                type="checkbox"
                value={cat.id}
                {...register("categoryIds")}
              />
              <span>{cat.category_name}</span>
            </CheckboxLabel>
          ))}
        </CategoryGrid>
      </InputGroup>

      <ButtonRow>
        <SubmitButton type="submit" disabled={isSessionSize ? isUpdating : isCreating}>
          {isSessionSize
            ? (isUpdating ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข')
            : (isCreating ? 'กำลังบันทึก...' : '➕  เพิ่มขนาดสินค้า')
          }
        </SubmitButton>
        <CancelButton type="button" onClick={onClose}>
          ยกเลิก
        </CancelButton>
      </ButtonRow>
    </Form>
  )
}

SizeForm.propTypes = {
  isOpenForm: PropTypes.bool.isRequired,
  setIsOpenForm: PropTypes.func.isRequired,
  size: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}
