import { useState, useEffect } from "react";
import { TextInput, View, FlatList, Text,ActivityIndicator, StyleSheet } from "react-native";
import axios from 'axios'

export default function SearchScreen(){
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        try {
            const response = await axios.get('http://localhost:4321/api/search', {
                params: { query: searchQuery}
            });
            setResults(response.data.users);
        } catch (err) {
            console.error('Search error:', err)
        } finally {
            setIsLoading(false)
        }
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
            { isLoading ? (
                <ActivityIndicator style={styles.loader} />
            ) : (
                <FlatList 
                data={results}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        <Text style={styles.resultText}>
                            {item.username}
                        </Text>
                    </View>
                ) }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        { searchQuery ? 'No results found' : 'Search for users'}
                    </Text>
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
    }
})