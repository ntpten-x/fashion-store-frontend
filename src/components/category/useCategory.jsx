/* eslint-disable react-refresh/only-export-components */
import { SelectCategory } from "../../services/apiCategory"
import { createContext, useContext } from "react"
import PropTypes from "prop-types"

const CategoryContext = createContext()
export default function CategoryProvider({ children }) {
    const { data: category, isLoading, error } = SelectCategory()
    return (
        <CategoryContext.Provider value={{ category, isLoading, error }}>
            {children}
        </CategoryContext.Provider>
    )
}

CategoryProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export function useCategory() {
    const context = useContext(CategoryContext)
    if (!context) {
        throw new Error('useCategory must be used within CategoryProvider')
    }
    return context
}
