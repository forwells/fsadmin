import {
    QueryClient,
    QueryClientProvider,
    QueryCache,
    MutationCache,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
export function QueryProvider({ children }) {
    const navigate = useNavigate()
    const client = new QueryClient({
        queryCache: new QueryCache({
            onError: (err) => {
                if (err.response.status == 401) {
                    navigate('/login')
                }
            }
        }),
        mutationCache: new MutationCache({
            onError: (err) => {
                if (err.response.status == 401) {
                    navigate('/login')
                }
            }
        }),
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 0,
                refetchInterval: false,
                retry: 1
            },
            mutations: {
                retry: 1,
            }
        }
    });

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}