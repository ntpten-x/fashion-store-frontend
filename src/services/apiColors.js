import { useQuery, useMutation, useQueryClient } from "react-query"
import { apiClient } from "./apiClient"

export function SelectColors(query) {
    const queryString = query ? '?' + new URLSearchParams(query).toString() : '';
    return useQuery({
        queryKey: ['colors', query],
        queryFn: () => apiClient(`/colors/findAll${queryString}`),
    })
}

export function InsertColors() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data) => apiClient('/colors/create', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['colors'])
        }
    })
}

export function UpdateColors() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => apiClient(`/colors/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['colors'])
        }
    })
}

export function DeleteColors() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => apiClient(`/colors/delete/${id}`, {
            method: 'DELETE'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['colors'])
        }
    })
}
