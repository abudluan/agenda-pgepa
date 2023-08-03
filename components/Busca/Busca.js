import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ClearIcon from 'react-native-vector-icons/MaterialIcons';

import {
    Container,
    SearchInput,
} from './BuscaStyles';

const Busca = ({ route }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { setores } = route.params;

    const handleSearch = () => {
        const formattedSearchValue = searchValue.trim().toLowerCase();

        if (formattedSearchValue === '') {
            setSearchResults([]);
        } else {
            const filteredSetores = setores.filter((setor) => {
                const formattedNome = setor.nome.toLowerCase();
                const formattedRamal = setor.ramal.toLowerCase();
                const formattedSigla = setor.sigla.toLowerCase();
                const formattedTitle = setor.title.toLowerCase();

                return (
                    formattedNome.includes(formattedSearchValue) ||
                    formattedSigla.includes(formattedSearchValue) ||
                    formattedTitle.includes(formattedSearchValue) ||
                    formattedRamal.includes(formattedSearchValue)
                );
            });

            setSearchResults(filteredSetores);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchValue]);

    const clearSearch = () => {
        setSearchValue('');
    };


    return (
        <Container>
            <SearchInput
                placeholder="Digite sua pesquisa..."
                placeholderTextColor="#fff"
                selectionColor="white"
                value={searchValue}
                onChangeText={(text) => setSearchValue(text)}
            />
            {searchValue !== '' && (
                <TouchableOpacity onPress={clearSearch} style={{ position: 'absolute', right: 20, top: 27 }}>
                    <ClearIcon name="clear" size={22} color="white" />
                </TouchableOpacity>
            )}

            <ScrollView>
                {searchResults.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text>{searchValue === '' ? 'Digite sua pesquisa' : 'Nenhum resultado encontrado.'}</Text>
                    </View>
                ) : (
                    searchResults.map((result) => (
                        <TouchableOpacity key={result.id} onPress={() => console.log('Clicou no resultado: ', result)}>
                            <Text>{result.sigla}</Text>
                            <Text>{result.title}</Text>
                            <Text>{result.nome}</Text>
                            <Text>{result.ramal}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </Container>
    );
};

export default Busca;
