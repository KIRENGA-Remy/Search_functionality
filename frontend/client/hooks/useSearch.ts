import { useState, useEffect } from "react";
import axios from "axios";

interface User{
    id: string;
    username: string;
}

interface ApiResponse{
    users: User[];
}

export default function useSearch(){
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if(query.trim() !==''){
                performSearch();
            }
        }, 500);
        return () => clearTimeout(timer);
    },[query]);

    const performSearch = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('http://localhost:4321/api/search',{
                params: { query }
            })
            setResults(response.data.users);
        } catch (err) {
            console.error('Search failed:', err)
        } finally {
            setIsLoading(false);
        }
    }

    return { query, setQuery, results, isLoading};
}