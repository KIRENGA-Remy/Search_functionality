import { useState, useEffect } from "react";
import axios from "axios";

export default function useSearch(){
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if(query.trim() !==''){
                performSearch();
            }
        })
    },[query]);

    const performSearch = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:4321/api/search',{
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