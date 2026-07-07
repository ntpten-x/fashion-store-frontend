import { useQuery, useMutation, useQueryClient } from "react-query"
import { apiClient } from "./apiClient"

export function SelectLocation() {
    return useQuery({
        queryKey: ['location'],
        queryFn: () => apiClient('/location/findAll'),
    })
}

export function InsertLocation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data) => apiClient('/location/create', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['location'])
        }
    })
}

export function UpdateLocation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => apiClient(`/location/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['location'])
        }
    })
}

export function DeleteLocation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => apiClient(`/location/delete/${id}`, {
            method: 'DELETE'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['location'])
        }
    })
}
