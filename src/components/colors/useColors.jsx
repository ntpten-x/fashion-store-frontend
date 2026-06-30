/* eslint-disable react-refresh/only-export-components */
import { SelectColors } from "../../services/apiColors"
import { createContext, useContext } from "react"
import PropTypes from "prop-types"

const ColorsContext = createContext()
export default function ColorsProvider({ children }) {
    const { data: colors, isLoading, error } = SelectColors()
    return (
        <ColorsContext.Provider value={{ colors, isLoading, error }}>
            {children}
        </ColorsContext.Provider>
    )
}

ColorsProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export function useColors() {
    const context = useContext(ColorsContext)
    if (!context) {
        throw new Error('useColors must be used within ColorsProvider')
    }
    return context
}
