import { useMutation, useQuery, useQueryClient } from "react-query";
import { login as loginApi, getCurrentUserApi, logoutApi } from "../../services/apiAuth";

export function useLogin(options) {
    return useMutation({
        mutationFn: loginApi,
        ...options
    });
}

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUserApi,
        retry: false // ไม่ต้องยิงซ้ำถ้าไม่ผ่าน
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'user' });
        }
    });
}