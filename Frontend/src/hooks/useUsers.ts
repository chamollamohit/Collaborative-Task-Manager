import { useQuery } from "@tanstack/react-query";
import { getUsersRequest } from "../api/user.api";

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await getUsersRequest();
            return res.data.data;
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes (User lists don't change often)
    });
};
