import { useState, useEffect } from "react";
import { TextInput, View, FlatList, Text,ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import axios from 'axios'

interface User{
    id: string;
    username: string;
}
interface ApiResponse{
    users: User[]
}

export default function SearchScreen(){
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [results, setResults] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] =  useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if(searchQuery.trim() !== ''){
                fetchSearchResults();
            } else {
                setResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    },[searchQuery]);

    const fetchSearchResults = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get<ApiResponse>('http://localhost:4321/api/search', {
                params: { query: searchQuery}
            });
            setResults(response.data.users);
        } catch (err) {
            setError('Failed to fetch results')
            console.error('Search error:', err)
        } finally {
            setIsLoading(false)
        }
    }
    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setSearchQuery('');
        setResults([]);
    }
    return(
        <View style={styles.container}>
            <TextInput 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search user..."
            style={styles.input}
            autoFocus
            />
            { error && <Text style={styles.errorText}>{error}</Text>}

            { selectedUser && (
                <View style={styles.selectedUserContainer}>
                    <Text style={styles.selectedUserText}>
                        Selected: {selectedUser.username}
                    </Text>
                </View>
            )}
            { isLoading ? (
                <ActivityIndicator style={styles.loader} />
            ) : (
                <FlatList 
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                    style={styles.resultItem}
                    onPress={() => handleUserSelect(item)}
                    >
                        <Text style={styles.resultText}>
                            {item.username}
                        </Text>
                    </TouchableOpacity>
                    // <View style={styles.resultItem}>
                    //     <Text style={styles.resultText}>
                    //         {item.username}
                    //     </Text>
                    // </View>
                ) }
                ListEmptyComponent={
                    searchQuery ? (
                        <Text style={styles.emptyText}>
                            No results found
                        </Text>
                    ) : null
                    // <Text style={styles.emptyText}>
                    //     { searchQuery ? 'No results found' : 'Search for users'}
                    // </Text>
                }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16
    },
    loader: {
        marginTop: 20
    },
    resultItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    resultText: {
        fontSize: 16
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888'
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10
    },
    selectedUserContainer: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 16
    },
    selectedUserText: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})