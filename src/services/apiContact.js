import { useQuery, useMutation, useQueryClient } from "react-query"
import { apiClient } from "./apiClient"

export function SelectContact() {
    return useQuery({
        queryKey: ['contact'],
        queryFn: () => apiClient('/contact/findAll'),
    })
}

export function InsertContact() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data) => apiClient('/contact/create', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['contact'])
        }
    })
}

export function UpdateContact() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => apiClient(`/contact/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['contact'])
        }
    })
}

export function DeleteContact() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => apiClient(`/contact/delete/${id}`, {
            method: 'DELETE'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['contact'])
        }
    })
}
