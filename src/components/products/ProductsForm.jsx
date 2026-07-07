import { useForm } from "react-hook-form"
import { InsertProduct, UpdateProduct, UploadProductImage, DeleteProductImage } from "../../services/apiProduct"
import { SelectCategory } from "../../services/apiCategory"
import { SelectColors } from "../../services/apiColors"
import { SelectSizes } from "../../services/apiSize"
import { useToast } from "../../ui/Toast.jsx"
import PropTypes from "prop-types"
import { useEffect, useRef, useState } from "react"
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background-color: var(--bg-color);
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: all 0.2s ease;
  min-height: 80px;
  resize: vertical;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    background-color: #ffffff;
    box-shadow: 0 0 0 4px var(--primary-light);
  }
`;

const Select = styled.select`
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
const CustomSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background-color: var(--bg-color);
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.6 : 1};
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  color: var(--text-main);
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$disabled ? 'var(--border-color)' : 'var(--primary-color)'};
  }

  &.open {
    border-color: var(--primary-color);
    background-color: #ffffff;
    box-shadow: 0 0 0 4px var(--primary-light);
  }
`;

const ColorPreviewCircle = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${props => props.$color || '#cccccc'};
  border: 1.5px solid rgba(0, 0, 0, 0.12);
  display: inline-block;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
`;

const SelectedColorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CustomDropdownList = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background-color: var(--panel-bg);
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  padding: 6px;
  box-sizing: border-box;
`;

const CustomDropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: all 0.15s ease;

  &:hover {
    background-color: var(--primary-light);
    color: var(--primary-color);
  }
  
  &.selected {
    background-color: var(--primary-light);
    color: var(--primary-color);
    font-weight: 600;
  }
`;


const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--primary-light);
  border: 1px solid var(--border-color);
  padding: 12px 16px;
  border-radius: 12px;
  margin-top: 4px;
  box-sizing: border-box;
`;

const ToggleLabel = styled.span`
  font-family: "Fredoka", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
  flex-grow: 1;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--primary-color);
  }
  
  &:checked + .popular {
    background-color: #ffb703 !important;
  }
  
  &:focus + span {
    box-shadow: 0 0 1px var(--primary-color);
  }
  
  &:checked + span:before {
    transform: translateX(22px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbdceb;
  transition: .3s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
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
    transform: translateY(-1px);
  }
`;

const UploadWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButtonLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px dashed var(--primary-color);
  background-color: var(--primary-light);
  color: var(--primary-hover);
  font-weight: 500;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  text-align: center;
  
  &:hover {
    background-color: #e6eefc;
    border-color: var(--primary-hover);
    transform: translateY(-1px);
  }
  
  &.uploading {
    opacity: 0.7;
    cursor: not-allowed;
    border-color: var(--text-muted);
    background-color: var(--bg-color);
    color: var(--text-muted);
  }
`;

const SizeCheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 8px 0;
`;

const SizeCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1.5px solid ${props => props.checked ? 'var(--primary-color)' : 'var(--border-color)'};
  background-color: ${props => props.checked ? 'var(--primary-light)' : 'var(--bg-color)'};
  color: ${props => props.checked ? 'var(--primary-color)' : 'var(--text-main)'};
  font-family: "Poppins", sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  
  &:hover {
    border-color: var(--primary-color);
    background-color: var(--primary-light);
    color: var(--primary-color);
  }

  input {
    display: none;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewImageWrapper = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 12px;
  border: 1.5px dashed var(--border-color);
  background-color: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-top: 6px;
  box-sizing: border-box;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  span {
    color: var(--text-muted);
    font-size: 0.82rem;
  }
`;

export default function ProductsForm({ isOpenForm, setIsOpenForm, product, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm()
  const isSessionProduct = Boolean(product?.id)
  const { mutate: createProduct, isLoading: isCreating } = InsertProduct()
  const { mutate: updateProduct, isLoading: isUpdating } = UpdateProduct()
  const { mutate: uploadImage, isLoading: isUploadingImage } = UploadProductImage()
  const { mutate: deleteProductImage } = DeleteProductImage()
  const toast = useToast()

  const [tempImageUrl, setTempImageUrl] = useState(null)
  const [selectedSizes, setSelectedSizes] = useState([])
  const isSubmittedRef = useRef(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    uploadImage(file, {
      onSuccess: (data) => {
        setValue("image", data.url, { shouldValidate: true })
        setTempImageUrl(data.url)
        toast.success("อัปเดตอัปโหลดรูปภาพสำเร็จแล้ว 📸✨")
      },
      onError: (err) => {
        toast.error(`อัปโหลดรูปภาพล้มเหลว: ${err.message}`)
      }
    })
  }

  // Fetch dropdown data
  const { data: categories } = SelectCategory()
  const { data: colors } = SelectColors()
  const { data: sizes } = SelectSizes()

  // Watch fields
  const imageUrl = watch("image")
  const selectedCategory = watch("category")
  const selectedColor = watch("color")

  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false)
  const colorDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target)) {
        setIsColorDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleColorSelect = (colorName) => {
    setValue("color", colorName, { shouldValidate: true })
    setIsColorDropdownOpen(false)
  }

  const activeColorObject = colors?.find(c => c.colors_name === selectedColor)

  // Filter colors and sizes by allowed categories
  const filteredColors = colors?.filter(col => {
    if (!selectedCategory) return true;
    if (!col.use || col.use.length === 0) return true;
    return col.use.some(cat => cat.category_name === selectedCategory);
  }) || [];

  const filteredSizes = sizes?.filter(sz => {
    if (!selectedCategory) return true;
    if (!sz.use || sz.use.length === 0) return true;
    return sz.use.some(cat => cat.category_name === selectedCategory);
  }) || [];

  // Size toggle handler
  const handleSizeToggle = (sizeName) => {
    setSelectedSizes((prev) => {
      if (prev.includes(sizeName)) {
        return prev.filter((s) => s !== sizeName);
      } else {
        return [...prev, sizeName];
      }
    });
  };

  // Reset color/size if they become invalid for the selected category
  useEffect(() => {
    if (!selectedCategory) return;

    const currentColor = watch("color");

    if (currentColor && colors) {
      const isColorValid = colors
        .filter(col => !col.use || col.use.length === 0 || col.use.some(cat => cat.category_name === selectedCategory))
        .some(c => c.colors_name === currentColor);
      if (!isColorValid) {
        setValue("color", "");
      }
    }

    if (selectedSizes.length > 0 && sizes) {
      const validSizesForCategory = sizes
        .filter(sz => !sz.use || sz.use.length === 0 || sz.use.some(cat => cat.category_name === selectedCategory))
        .map(s => s.size_name);
      
      const filteredSelected = selectedSizes.filter(s => validSizesForCategory.includes(s));
      if (filteredSelected.length !== selectedSizes.length) {
        setSelectedSizes(filteredSelected);
      }
    }
  }, [selectedCategory, colors, sizes, setValue, watch, selectedSizes]);

  useEffect(() => {
    if (isOpenForm) {
      reset({
        ...product,
        is_use: product && product.is_use !== undefined ? product.is_use : true,
        is_popular: product && product.is_popular !== undefined ? product.is_popular : false
      })
      const initialSizes = product?.sizes || (product?.size ? product.size.split(',').map(s => s.trim()).filter(Boolean) : []);
      setSelectedSizes(initialSizes);
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        color: '',
        category: '',
        image: '',
        is_use: true,
        is_popular: false
      })
      setSelectedSizes([]);
    }
  }, [isOpenForm, reset, product])

  useEffect(() => {
    return () => {
      // If the component is unmounted and the form was NOT successfully submitted,
      // delete the temporary image that was uploaded during this session.
      if (!isSubmittedRef.current && tempImageUrl) {
        deleteProductImage(tempImageUrl)
      }
    }
  }, [tempImageUrl, deleteProductImage])

  const onSubmit = (data) => {
    if (selectedSizes.length === 0) {
      toast.error('กรุณาเลือกขนาดสินค้าอย่างน้อย 1 ขนาด 🥺');
      return;
    }

    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      color: data.color,
      size: selectedSizes,
      category: data.category,
      image: data.image,
      is_use: data.is_use !== undefined ? data.is_use : true,
      is_popular: data.is_popular !== undefined ? data.is_popular : false
    }

    if (isSessionProduct) {
      updateProduct({ id: product.id, data: payload }, {
        onSuccess: () => {
          isSubmittedRef.current = true
          toast.success('อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว 🛍️✨')
          reset()
          setIsOpenForm(false)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    } else {
      createProduct(payload, {
        onSuccess: () => {
          isSubmittedRef.current = true
          toast.success('บันทึกสินค้าใหม่เรียบร้อยแล้ว 🎉🛍️')
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
        {isSessionProduct ? "✏️ แก้ไขข้อมูลสินค้า" : "➕ เพิ่มสินค้าใหม่"}
      </FormHeader>

      <InputGroup>
        <Label htmlFor="name">ชื่อสินค้า</Label>
        <Input
          type="text"
          id="name"
          placeholder="เช่น บิกินี่ผ้าสแปนเด็กซ์"
          {...register("name", { required: "กรุณากรอกชื่อสินค้า" })}
        />
        {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="description">รายละเอียดสินค้า (ไม่จำเป็นต้องระบุ)</Label>
        <TextArea
          id="description"
          {...register("description")}
        />
        {errors.description && <ErrorMsg>{errors.description.message}</ErrorMsg>}
      </InputGroup>

      <FormGrid>
        <InputGroup>
          <Label htmlFor="price">ราคา (บาท)</Label>
          <Input
            type="number"
            step="0.01"
            id="price"
            {...register("price", {
              required: "กรุณากรอกราคาสินค้า",
              min: { value: 0, message: "ราคาต้องมากกว่าหรือเท่ากับ 0 บาท" }
            })}
            onKeyDown={(e) => {
              // Allow: Backspace, Delete, Tab, Escape, Enter, Decimal point
              if (
                ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.'].includes(e.key) ||
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()) && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Home, End, Arrow keys
                ['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
              ) {
                // Limit decimal point to at most one
                if (e.key === '.' && e.currentTarget.value.includes('.')) {
                  e.preventDefault();
                }
                return;
              }
              // Block spaces and any non-numeric keypresses
              if (e.key === ' ' || isNaN(Number(e.key))) {
                e.preventDefault();
              }
            }}
          />
          {errors.price && <ErrorMsg>{errors.price.message}</ErrorMsg>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="category">หมวดหมู่สินค้า</Label>
          <Select
            id="category"
            {...register("category", { required: "กรุณาเลือกหมวดหมู่สินค้า" })}
          >
            <option value="">-- เลือกหมวดหมู่ --</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.category_name}>
                {cat.category_name}
              </option>
            ))}
          </Select>
          {errors.category && <ErrorMsg>{errors.category.message}</ErrorMsg>}
        </InputGroup>
      </FormGrid>

      <FormGrid>
        <InputGroup ref={colorDropdownRef}>
          <Label>สีสินค้า</Label>
          <input type="hidden" {...register("color", { required: "กรุณาเลือกสีสินค้า" })} />
          <CustomSelectContainer>
            <CustomSelectHeader
              $disabled={!selectedCategory}
              className={isColorDropdownOpen ? 'open' : ''}
              onClick={() => selectedCategory && setIsColorDropdownOpen(!isColorDropdownOpen)}
            >
              {!selectedCategory ? (
                <span>-- กรุณาเลือกหมวดหมู่ก่อน --</span>
              ) : activeColorObject ? (
                <SelectedColorInfo>
                  <ColorPreviewCircle $color={activeColorObject.colors_code} />
                  <span>{activeColorObject.colors_name}</span>
                </SelectedColorInfo>
              ) : (
                <span>-- เลือกสี --</span>
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isColorDropdownOpen ? '▲' : '▼'}</span>
            </CustomSelectHeader>

            {isColorDropdownOpen && selectedCategory && (
              <CustomDropdownList>
                {filteredColors.length === 0 ? (
                  <div style={{ padding: '8px 12px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    ไม่มีสีสำหรับหมวดหมู่นี้
                  </div>
                ) : (
                  filteredColors.map((col) => {
                    const isSelected = selectedColor === col.colors_name;
                    return (
                      <CustomDropdownItem
                        key={col.id}
                        className={isSelected ? 'selected' : ''}
                        onClick={() => handleColorSelect(col.colors_name)}
                      >
                        <ColorPreviewCircle $color={col.colors_code} />
                        <span>{col.colors_name}</span>
                      </CustomDropdownItem>
                    );
                  })
                )}
              </CustomDropdownList>
            )}
          </CustomSelectContainer>
          {errors.color && <ErrorMsg>{errors.color.message}</ErrorMsg>}
        </InputGroup>

        <InputGroup>
          <Label>ขนาดสินค้า (เลือกได้หลายขนาด)</Label>
          {!selectedCategory ? (
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', padding: '8px 0' }}>
              -- กรุณาเลือกหมวดหมู่ก่อน --
            </div>
          ) : filteredSizes.length === 0 ? (
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', padding: '8px 0' }}>
              ไม่มีข้อมูลขนาดสำหรับหมวดหมู่นี้
            </div>
          ) : (
            <SizeCheckboxGroup>
              {filteredSizes.map((sz) => {
                const isChecked = selectedSizes.includes(sz.size_name);
                return (
                  <SizeCheckboxLabel key={sz.id} checked={isChecked}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSizeToggle(sz.size_name)}
                    />
                    {sz.size_name}
                  </SizeCheckboxLabel>
                );
              })}
            </SizeCheckboxGroup>
          )}
        </InputGroup>
      </FormGrid>

      <InputGroup>
        <Label>รูปภาพสินค้า</Label>
        <UploadWrapper>
          <FileInput
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploadingImage}
          />
          <UploadButtonLabel htmlFor="file-upload" className={isUploadingImage ? 'uploading' : ''}>
            {isUploadingImage ? '⏳ กำลังอัปโหลดรูปภาพ...' : '📸 เลือกไฟล์รูปภาพเพื่ออัปโหลด'}
          </UploadButtonLabel>
        </UploadWrapper>

        <Label style={{ marginTop: '8px', fontSize: '0.8rem', opacity: 0.8 }}>หรือใส่ลิงก์รูปภาพ (URL)</Label>
        <Input
          type="text"
          id="image"
          placeholder="เช่น https://images.unsplash.com/..."
          {...register("image", { required: "กรุณาใส่รูปภาพสินค้า" })}
        />
        {errors.image && <ErrorMsg>{errors.image.message}</ErrorMsg>}

        <PreviewImageWrapper>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Product Preview"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <span>ไม่มีรูปภาพตัวอย่าง</span>
          )}
        </PreviewImageWrapper>
      </InputGroup>

      <ToggleContainer>
        <ToggleLabel>เปิดใช้งานสินค้า (แสดงในหน้าร้านค้า)</ToggleLabel>
        <Switch>
          <SwitchInput
            type="checkbox"
            id="is_use"
            {...register("is_use")}
          />
          <Slider />
        </Switch>
      </ToggleContainer>

      <ToggleContainer style={{ backgroundColor: '#fffdf0', borderColor: '#ffeeb3' }}>
        <ToggleLabel style={{ color: '#856404' }}>🔥 สินค้ายอดนิยม (แสดงในสไลเดอร์ยอดนิยม)</ToggleLabel>
        <Switch>
          <SwitchInput
            type="checkbox"
            id="is_popular"
            {...register("is_popular")}
          />
          <Slider className="popular" style={{ backgroundColor: '#ffeeba' }} />
        </Switch>
      </ToggleContainer>

      <ButtonRow>
        <SubmitButton type="submit" disabled={isSessionProduct ? isUpdating : isCreating}>
          {isSessionProduct
            ? (isUpdating ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข')
            : (isCreating ? 'กำลังบันทึก...' : '➕ เพิ่มสินค้า')
          }
        </SubmitButton>
        <CancelButton type="button" onClick={onClose}>
          ยกเลิก
        </CancelButton>
      </ButtonRow>
    </Form>
  )
}

ProductsForm.propTypes = {
  isOpenForm: PropTypes.bool.isRequired,
  setIsOpenForm: PropTypes.func.isRequired,
  product: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}
