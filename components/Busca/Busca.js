import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ClearIcon from 'react-native-vector-icons/MaterialIcons';

import {
    Container,
    SearchInput,
    BodyApp,
    CardBody,
    SiglaCard,
    AvatarProfile,
    TitleCard,
    RamalCard,
    PessoaCard,
    SearchNotFound,
} from './BuscaStyles';

import AvatarPhoto from '../../src/avatarProfile.png';

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
                <BodyApp>
                    {searchResults.length === 0 ? (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <SearchNotFound>{searchValue === '' ? 'Pesquise por nome, ramal, setor ou sigla' : 'Nenhum resultado encontrado.'}</SearchNotFound>
                        </View>
                    ) : (
                        searchResults.map((result) => (

                            <CardBody key={result.id}>
                                <SiglaCard>{result.sigla}</SiglaCard>
                                <AvatarProfile source={AvatarPhoto} resizeMode="contain" />
                                <TitleCard><Icon name="office-building-marker" size={25} color="#008000" /> {result.title}</TitleCard>
                                <PessoaCard><Icon name="account-group" size={25} color="#008000" /> Responsável: {result.nome}</PessoaCard>
                                <RamalCard><Icon name="phone" size={25} color="#008000" /> Ramal: {result.ramal}</RamalCard>
                            </CardBody>

                        ))
                    )}
                </BodyApp>
            </ScrollView>
        </Container>
    );
};

export default Busca;
