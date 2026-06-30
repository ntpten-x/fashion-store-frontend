/* eslint-disable react-refresh/only-export-components */
import { SelectSizes } from "../../services/apiSize"
import { createContext, useContext } from "react"
import PropTypes from "prop-types"

const SizeContext = createContext()
export default function SizeProvider({ children }) {
    const { data: sizes, isLoading, error } = SelectSizes()
    return (
        <SizeContext.Provider value={{ sizes, isLoading, error }}>
            {children}
        </SizeContext.Provider>
    )
}

SizeProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export function useSize() {
    const context = useContext(SizeContext)
    if (!context) {
        throw new Error('useSize must be used within SizeProvider')
    }
    return context
}
