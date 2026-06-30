/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react"
import { SelectProduct } from "../../services/apiProduct"
import PropTypes from "prop-types"

const ProductsContext = createContext()

export default function ProductsProvider({ children }) {
    const { isLoading, data: products, error } = SelectProduct()
    return (
        <ProductsContext.Provider value={{ isLoading, products, error }}>
            {children}
        </ProductsContext.Provider>
    )
}

ProductsProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export function useProducts() {
    const context = useContext(ProductsContext)
    if (!context) {
        throw new Error('useProducts must be used within ProductsProvider')
    }
    return context
}

