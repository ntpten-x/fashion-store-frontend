import { useForm } from "react-hook-form"
import { InsertContact, UpdateContact } from "../../services/apiContact"
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

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background-color: var(--bg-color);
  font-family: "Fredoka", sans-serif;
  font-size: 0.9rem;
  color: var(--text-main);
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--primary-color);
    background-color: #ffffff;
    box-shadow: 0 0 0 4px var(--primary-light);
  }
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

const PLATFORMS = {
  facebook: "📘 Facebook",
  instagram: "📸 Instagram",
  line: "💬 Line",
  phone: "📞 เบอร์โทรศัพท์",
  other: "🔗 ช่องทางอื่นๆ"
};

export default function ContactForm({ isOpenForm, setIsOpenForm, contact, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const isEditing = Boolean(contact?.id);
  const { mutate: createContact, isLoading: isCreating } = InsertContact();
  const { mutate: updateContact, isLoading: isUpdating } = UpdateContact();
  const toast = useToast();

  useEffect(() => {
    if (isOpenForm) {
      reset(contact || { platform: 'facebook', value: '' });
    } else {
      reset({ platform: 'facebook', value: '' });
    }
  }, [isOpenForm, reset, contact]);

  const onSubmit = (data) => {
    const payload = {
      platform: data.platform,
      value: data.value
    };

    if (isEditing) {
      updateContact({ id: contact.id, data: payload }, {
        onSuccess: () => {
          toast.success('อัปเดตข้อมูลการติดต่อเรียบร้อยแล้ว 🌸✨');
          reset();
          setIsOpenForm(false);
        },
        onError: (error) => {
          toast.error(error.message);
        }
      });
    } else {
      createContact(payload, {
        onSuccess: () => {
          toast.success('เพิ่มข้อมูลการติดต่อเรียบร้อยแล้ว 🎉🌸');
          reset();
          setIsOpenForm(false);
        },
        onError: (error) => {
          toast.error(error.message);
        }
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>
        {isEditing ? "✏️ แก้ไขข้อมูลการติดต่อ" : "➕ เพิ่มช่องการติดต่อใหม่"}
      </FormHeader>

      <InputGroup>
        <Label htmlFor="platform">ช่องทางติดต่อ</Label>
        <Select id="platform" {...register("platform", { required: true })}>
          {Object.keys(PLATFORMS).map((key) => (
            <option key={key} value={key}>
              {PLATFORMS[key]}
            </option>
          ))}
        </Select>
      </InputGroup>

      <InputGroup>
        <Label htmlFor="value">ข้อมูลติดต่อ (ลิงก์ / ไอดี / เบอร์โทร)</Label>
        <Input
          type="text"
          id="value"
          {...register("value", { required: "กรุณากรอกข้อมูลติดต่อ" })}
        />
        {errors.value && <ErrorMsg>{errors.value.message}</ErrorMsg>}
      </InputGroup>

      <ButtonRow>
        <SubmitButton type="submit" disabled={isEditing ? isUpdating : isCreating}>
          {isEditing
            ? (isUpdating ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข')
            : (isCreating ? 'กำลังบันทึก...' : 'เพิ่มช่องทาง')
          }
        </SubmitButton>
        <CancelButton type="button" onClick={onClose}>
          ยกเลิก
        </CancelButton>
      </ButtonRow>
    </Form>
  );
}

ContactForm.propTypes = {
  isOpenForm: PropTypes.bool.isRequired,
  setIsOpenForm: PropTypes.func.isRequired,
  contact: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
