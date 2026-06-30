import { useQuery, useMutation, useQueryClient } from "react-query"
import { apiClient } from "./apiClient"

export function SelectProduct() {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => apiClient('/products/findAll')
    })
}

export function InsertProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data) => apiClient('/products/create', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['products'])
        }
    })
}

export function UpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => apiClient(`/products/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['products'])
        }
    })
}

export function DeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => apiClient(`/products/delete/${id}`, {
            method: 'DELETE'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['products'])
        }
    })
}

export function UploadProductImage() {
    return useMutation({
        mutationFn: (file) => {
            const formData = new FormData()
            formData.append('file', file)
            return apiClient('/products/upload', {
                method: 'POST',
                body: formData
            })
        }
    })
}

export function DeleteProductImage() {
    return useMutation({
        mutationFn: (url) => apiClient('/products/delete-image', {
            method: 'POST',
            body: JSON.stringify({ url })
        })
    })
}


