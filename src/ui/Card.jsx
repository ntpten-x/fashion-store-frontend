import styled from "styled-components";
import PropTypes from "prop-types";

const CardContainer = styled.div`
  background-color: var(--panel-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 370px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--secondary-color);
  }

  @media (max-width: 768px) {
    min-height: 320px;
  }
  @media (max-width: 480px) {
    min-height: 290px;
  }
`;

const CardImageWrapper = styled.div`
  width: 100%;
  height: 250px;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 768px) {
    height: 200px;
  }
  @media (max-width: 480px) {
    height: 170px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${CardContainer}:hover & {
    transform: scale(1.08);
  }
`;

const ImagePlaceholder = styled.div`
  font-size: 4.5rem;
  user-select: none;
  animation: floatEmoji 4s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
  @media (max-width: 480px) {
    font-size: 3rem;
  }

  @keyframes floatEmoji {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-6px) rotate(4deg); }
  }
`;

const FloatingCategory = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: var(--secondary-hover);
  border: 1px solid var(--secondary-color);
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  font-family: "Fredoka", sans-serif;
  z-index: 2;
  box-shadow: var(--shadow-sm);
`;

const CardBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 6px;
  text-align: left;
`;

const ProductName = styled.h3`
  font-family: "Fredoka", "Poppins", sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.div`
  font-family: "Fredoka", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-hover);
  margin-bottom: 2px;
`;

const ViewMoreButton = styled.button`
  background: linear-gradient(135deg, #85e3ff 0%, var(--secondary-color) 100%);
  color: white;
  width: 100%;
  font-size: 0.85rem;
  padding: 10px 16px;
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
`;

export default function Card({ product, onViewMore }) {
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

Card.propTypes = {
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



