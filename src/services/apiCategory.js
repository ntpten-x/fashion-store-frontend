import { useQuery, useMutation, useQueryClient } from "react-query"
import { apiClient } from "./apiClient"

export function SelectCategory() {
    return useQuery({
        queryKey: ['category'],
        queryFn: () => apiClient('/category/findAll'),
    })
}

export function InsertCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data) => apiClient('/category/create', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['category'])
        }
    })
}

export function UpdateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => apiClient(`/category/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['category'])
        }
    })
}

export function DeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => apiClient(`/category/delete/${id}`, {
            method: 'DELETE'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['category'])
        }
    })
}