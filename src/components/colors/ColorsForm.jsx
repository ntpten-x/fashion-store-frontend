import { useForm } from "react-hook-form"
import { InsertColors, UpdateColors } from "../../services/apiColors"
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

const ColorPickerContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
`;

const ColorPickerInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 48px;
  height: 48px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  
  &::-webkit-color-swatch {
    border-radius: 12px;
    border: 1.5px solid var(--border-color);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
  
  &::-moz-color-swatch {
    border-radius: 12px;
    border: 1.5px solid var(--border-color);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
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

export default function ColorsForm({ isOpenForm, setIsOpenForm, color, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm()
  const isSessionColor = Boolean(color?.id)
  const { mutate: createColor, isLoading: isCreating } = InsertColors()
  const { mutate: updateColor, isLoading: isUpdating } = UpdateColors()
  const toast = useToast()

  const { data: categories } = SelectCategory()

  const colorsCodeValue = watch("colors_code", "#ff6b8b")

  useEffect(() => {
    if (isOpenForm) {
      reset({
        colors_name: color.colors_name || '',
        colors_code: color.colors_code || '#ff6b8b',
        categoryIds: color.use?.map(cat => cat.id) || []
      })
    } else {
      reset({ colors_name: '', colors_code: '#ff6b8b', categoryIds: [] })
    }
  }, [isOpenForm, reset, color])

  const onSubmit = (data) => {
    const payload = {
      colors_name: data.colors_name,
      colors_code: data.colors_code,
      categoryIds: data.categoryIds || []
    }

    if (isSessionColor) {
      updateColor({ id: color.id, data: payload }, {
        onSuccess: () => {
          toast.success('อัปเดตข้อมูลสีสินค้าเรียบร้อยแล้ว 🎨✨')
          reset()
          setIsOpenForm(false)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    } else {
      createColor(payload, {
        onSuccess: () => {
          toast.success('บันทึกสีสินค้าใหม่เรียบร้อยแล้ว 🎉🎨')
          reset()
          setIsOpenForm(false)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    }
  }

  const handlePickerChange = (e) => {
    setValue("colors_code", e.target.value.toUpperCase(), { shouldValidate: true })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>
        {isSessionColor ? "✏️ แก้ไขข้อมูลสีสินค้า" : "➕ เพิ่มสีสินค้าใหม่"}
      </FormHeader>

      <InputGroup>
        <Label htmlFor="colors_name">ชื่อสี</Label>
        <Input
          type="text"
          id="colors_name"
          placeholder="เช่น พาสเทลชมพู, โอลด์โรส ฯลฯ"
          {...register("colors_name", { required: "กรุณากรอกชื่อสี" })}
        />
        {errors.colors_name && <ErrorMsg>{errors.colors_name.message}</ErrorMsg>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="colors_code">รหัสสี (Hex)</Label>
        <ColorPickerContainer>
          <Input
            type="text"
            id="colors_code"
            placeholder="เช่น #FF6B8B"
            {...register("colors_code", {
              required: "กรุณากรอกรหัสสี",
              pattern: {
                value: /^#[0-9A-F]{6}$/i,
                message: "กรุณากรอกรหัสสีในรูปแบบ Hex (เช่น #FF6B8B)"
              }
            })}
          />
          <ColorPickerInput
            type="color"
            value={colorsCodeValue || "#ff6b8b"}
            onChange={handlePickerChange}
          />
        </ColorPickerContainer>
        {errors.colors_code && <ErrorMsg>{errors.colors_code.message}</ErrorMsg>}
      </InputGroup>

      <InputGroup>
        <Label>หมวดหมู่สินค้าที่สามารถใช้สีนี้ได้</Label>
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
        <SubmitButton type="submit" disabled={isSessionColor ? isUpdating : isCreating}>
          {isSessionColor
            ? (isUpdating ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข')
            : (isCreating ? 'กำลังบันทึก...' : '✨ เพิ่มสีสินค้า')
          }
        </SubmitButton>
        <CancelButton type="button" onClick={onClose}>
          ยกเลิก
        </CancelButton>
      </ButtonRow>
    </Form>
  )
}

ColorsForm.propTypes = {
  isOpenForm: PropTypes.bool.isRequired,
  setIsOpenForm: PropTypes.func.isRequired,
  color: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}
