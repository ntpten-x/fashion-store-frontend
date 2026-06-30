import styled from "styled-components";
import PropTypes from "prop-types";

const CardContainer = styled.div`
  background-color: var(--panel-bg);
  border-radius: 14px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  transition: all 0.25s ease-in-out;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--secondary-color);
  }

  @media (max-width: 768px) {
    min-height: 270px;
  }
  @media (max-width: 576px) {
    min-height: 230px;
    border-radius: 10px;
  }
  @media (max-width: 360px) {
    min-height: 215px;
  }
`;

const CardImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 768px) {
    height: 140px;
  }
  @media (max-width: 576px) {
    height: 120px;
  }
  @media (max-width: 360px) {
    height: 105px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${CardContainer}:hover & {
    transform: scale(1.06);
  }
`;

const ImagePlaceholder = styled.div`
  font-size: 3.5rem;
  user-select: none;
  animation: floatEmoji 4s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @keyframes floatEmoji {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-4px) rotate(3deg); }
  }
`;

const FloatingCategory = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: var(--secondary-hover);
  border: 1px solid var(--secondary-color);
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  font-family: "Fredoka", sans-serif;
  z-index: 2;
  @media (max-width: 576px) {
    font-size: 0.55rem;
    padding: 1px 6px;
    top: 6px;
    left: 6px;
  }
`;

const CardBody = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 4px;
  text-align: left;

  @media (max-width: 768px) {
    padding: 10px;
    gap: 3px;
  }
  @media (max-width: 576px) {
    padding: 8px;
    gap: 2px;
  }
`;

const ProductName = styled.h3`
  font-family: "Fredoka", "Poppins", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.88rem;
  }
  @media (max-width: 576px) {
    font-size: 0.8rem;
  }
`;

const ProductPrice = styled.div`
  font-family: "Fredoka", sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-hover);
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2px;
  }
  @media (max-width: 576px) {
    font-size: 0.88rem;
    margin-bottom: 2px;
  }
`;

const ViewMoreButton = styled.button`
  background: linear-gradient(135deg, #85e3ff 0%, var(--secondary-color) 100%);
  color: white;
  width: 100%;
  font-size: 0.8rem;
  padding: 9px 14px;
  border-radius: 9999px;
  font-family: "Fredoka", sans-serif;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(133, 227, 255, 0.2);
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-top: auto;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: linear-gradient(135deg, #70d6f4 0%, var(--secondary-hover) 100%);
    transform: translateY(-2.5px);
    box-shadow: 0 8px 16px rgba(133, 227, 255, 0.35);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(133, 227, 255, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 7px 12px;
  }
  @media (max-width: 576px) {
    font-size: 0.7rem;
    padding: 6px 10px;
  }
`;

export default function RowCard({ product, onViewMore }) {
  const { name, price, category, image } = product;

  const getCategoryEmoji = (cat) => {
    const c = String(cat || "").toLowerCase();
    if (c.includes("shirt") || c.includes("cloth") || c.includes("top") || c.includes("เสื้อ")) return "👕";
    if (c.includes("pant") || c.includes("jean") || c.includes("กางเกง")) return "👖";
    if (c.includes("dress") || c.includes("กระโปรง")) return "👗";
    if (c.includes("shoe") || c.includes("รองเท้า")) return "👟";
    if (c.includes("hat") || c.includes("cap") || c.includes("หมวก")) return "🧢";
    if (c.includes("bag") || c.includes("กระเป๋า")) return "🎒";
    return "🎁";
  };

  return (
    <CardContainer>
      <CardImageWrapper>
        {category && <FloatingCategory>{category}</FloatingCategory>}
        {image ? (
          <CardImage src={image} alt={name} />
        ) : (
          <ImagePlaceholder>{getCategoryEmoji(category)}</ImagePlaceholder>
        )}
      </CardImageWrapper>

      <CardBody>
        <ProductName title={name}>{name}</ProductName>
        <ProductPrice>฿{Number(price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</ProductPrice>

        <ViewMoreButton onClick={() => onViewMore && onViewMore(product)}>
          ดูเพิ่มเติม
        </ViewMoreButton>
      </CardBody>
    </CardContainer>
  );
}

RowCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string,
    size: PropTypes.string,
    category: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onViewMore: PropTypes.func,
};

