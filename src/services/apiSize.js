import { useQuery, useMutation, useQueryClient } from "react-query"
import { apiClient } from "./apiClient"

export function SelectSizes() {
    return useQuery({
        queryKey: ['size'],
        queryFn: () => apiClient('/size/findAll'),
    })
}

export function InsertSizes() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data) => apiClient('/size/create', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['size'])
        }
    })
}

export function UpdateSizes() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => apiClient(`/size/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['size'])
        }
    })
}

export function DeleteSizes() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => apiClient(`/size/delete/${id}`, {
            method: 'DELETE'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['size'])
        }
    })
}
