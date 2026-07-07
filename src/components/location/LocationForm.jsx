import { useForm } from "react-hook-form"
import { InsertLocation, UpdateLocation } from "../../services/apiLocation"
import { useToast } from "../../ui/Toast.jsx"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
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

const ToggleWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 4px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Poppins", sans-serif;
  font-size: 0.88rem;
  color: var(--text-main);
  cursor: pointer;
  
  input {
    cursor: pointer;
    accent-color: var(--primary-color);
  }
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

export default function LocationForm({ isOpenForm, setIsOpenForm, location, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [inputMode, setInputMode] = useState("coordinates"); // "coordinates" or "url"
  const isEditing = Boolean(location?.id);
  const { mutate: createLocation, isLoading: isCreating } = InsertLocation();
  const { mutate: updateLocation, isLoading: isUpdating } = UpdateLocation();
  const toast = useToast();

  useEffect(() => {
    if (isOpenForm) {
      reset(location || { name: '', lat: '', lng: '', mapUrl: '' });
      setInputMode("coordinates");
    } else {
      reset({ name: '', lat: '', lng: '', mapUrl: '' });
      setInputMode("coordinates");
    }
  }, [isOpenForm, reset, location]);

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
    };

    if (inputMode === "url") {
      payload.mapUrl = data.mapUrl;
    } else {
      payload.lat = Number(data.lat);
      payload.lng = Number(data.lng);
    }

    if (isEditing) {
      updateLocation({ id: location.id, data: payload }, {
        onSuccess: () => {
          toast.success('อัปเดตพิกัดสาขาเรียบร้อยแล้ว 🌸✨');
          reset();
          setIsOpenForm(false);
        },
        onError: (error) => {
          toast.error(error.message);
        }
      });
    } else {
      createLocation(payload, {
        onSuccess: () => {
          toast.success('เพิ่มพิกัดสาขาใหม่เรียบร้อยแล้ว 🎉🌸');
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
        {isEditing ? "✏️ แก้ไขข้อมูลพิกัดสาขา" : "➕ เพิ่มพิกัดสาขาใหม่"}
      </FormHeader>

      <InputGroup>
        <Label htmlFor="name">ชื่อสาขา / ชื่อพิกัด</Label>
        <Input
          type="text"
          id="name"
          {...register("name", { required: "กรุณากรอกชื่อสาขา" })}
        />
        {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
      </InputGroup>

      <InputGroup style={{ gap: '10px' }}>
        <Label>วิธีระบุตำแหน่งพิกัด</Label>
        <ToggleWrapper>
          <RadioLabel>
            <input
              type="radio"
              name="inputMode"
              value="coordinates"
              checked={inputMode === "coordinates"}
              onChange={() => setInputMode("coordinates")}
            />
            ระบุด้วยพิกัด (Lat / Lng)
          </RadioLabel>
          <RadioLabel>
            <input
              type="radio"
              name="inputMode"
              value="url"
              checked={inputMode === "url"}
              onChange={() => setInputMode("url")}
            />
            ระบุด้วยลิงก์ Google Maps
          </RadioLabel>
        </ToggleWrapper>
      </InputGroup>

      {inputMode === "url" ? (
        <InputGroup>
          <Label htmlFor="mapUrl">ลิงก์ Google Maps (URL)</Label>
          <Input
            type="text"
            id="mapUrl"
            placeholder="เช่น https://maps.app.goo.gl/dfqrB9zr8pePnpfr8"
            {...register("mapUrl", { required: "กรุณากรอกลิงก์ Google Maps" })}
          />
          {errors.mapUrl && <ErrorMsg>{errors.mapUrl.message}</ErrorMsg>}
        </InputGroup>
      ) : (
        <>
          <InputGroup>
            <Label htmlFor="lat">ละติจูด (Latitude)</Label>
            <Input
              type="number"
              step="any"
              id="lat"
              placeholder="เช่น 13.746862"
              {...register("lat", {
                required: "กรุณากรอกพิกัด Latitude",
                valueAsNumber: true,
                validate: val => !isNaN(val) || "พิกัดต้องเป็นตัวเลข"
              })}
            />
            {errors.lat && <ErrorMsg>{errors.lat.message}</ErrorMsg>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="lng">ลองจิจูด (Longitude)</Label>
            <Input
              type="number"
              step="any"
              id="lng"
              placeholder="เช่น 100.535081"
              {...register("lng", {
                required: "กรุณากรอกพิกัด Longitude",
                valueAsNumber: true,
                validate: val => !isNaN(val) || "พิกัดต้องเป็นตัวเลข"
              })}
            />
            {errors.lng && <ErrorMsg>{errors.lng.message}</ErrorMsg>}
          </InputGroup>
        </>
      )}

      <ButtonRow>
        <SubmitButton type="submit" disabled={isEditing ? isUpdating : isCreating}>
          {isEditing
            ? (isUpdating ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข')
            : (isCreating ? 'กำลังบันทึก...' : 'เพิ่มพิกัดสาขา')
          }
        </SubmitButton>
        <CancelButton type="button" onClick={onClose}>
          ยกเลิก
        </CancelButton>
      </ButtonRow>
    </Form>
  );
}

LocationForm.propTypes = {
  isOpenForm: PropTypes.bool.isRequired,
  setIsOpenForm: PropTypes.func.isRequired,
  location: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
