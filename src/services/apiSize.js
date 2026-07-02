import { useQuery, useMutation, useQueryClient } from "react-query"
import { apiClient } from "./apiClient"

export function SelectSizes(query) {
    const queryString = query ? '?' + new URLSearchParams(query).toString() : '';
    return useQuery({
        queryKey: ['size', query],
        queryFn: () => apiClient(`/size/findAll${queryString}`),
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
