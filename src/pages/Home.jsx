import styled from "styled-components";
import ProductsCard from "../components/products/ProductsCard";
import ProductRowCard from "../components/products/ProductRowCard";


const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;




export default function Home() {


  return (
    <HomeContainer>
      <ProductsCard />
      <ProductRowCard />
    </HomeContainer>
  );
}
