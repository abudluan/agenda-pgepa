import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Modal, Button, Toast, Spinner, Box } from 'native-base';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ClearIcon from 'react-native-vector-icons/MaterialIcons';

import {
    Container,
    SearchInput,
    BodyApp,
    CardControl,
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);searchResults
    const navigation = useNavigation();
    const { setores, isUserLoggedIn } = route.params;

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

    const handleSelectContact = (setorId) => {
        setSelectedContact(setorId);
        setShowDeleteModal(true);
    };

    const handleExcluirContato = async () => {
        try {
            if (selectedContact) {
                const setorId = selectedContact;
                // Excluir o documento do contato
                await deleteDoc(doc(db, 'setores', setorId));
                // Exibir mensagem de sucesso
                Toast.show({
                    title: 'Contato excluído',
                    description: 'O contato foi excluído com sucesso.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setShowDeleteModal(false);
                setSelectedContact(null);
                fetchSetores();
            }
        } catch (error) {
            console.error('Erro ao excluir o contato:', error);
            // Exibir mensagem de erro
            Toast.show({
                title: 'Erro ao excluir',
                description: 'Ocorreu um erro ao excluir o contato. Por favor, tente novamente mais tarde.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleEditContact = (setorId) => {
        navigation.navigate('EditContact', { setorId });
      };


    return (
        <NativeBaseProvider>
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
                                    {isUserLoggedIn && (
                                        <CardControl>
                                            <TouchableOpacity onPress={() => handleEditContact(result.id)} style={{ right: 25, top: 10 }}>
                                                <Icon name="account-edit" size={30} color="#008000" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleSelectContact(result.id)} style={{ right: 15, top: 10 }}>
                                                <Icon name="delete" size={30} color="#008000" />
                                            </TouchableOpacity>
                                        </CardControl>
                                    )}
                                </CardBody>

                            ))
                        )}
                    </BodyApp>
                </ScrollView>
            </Container>
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton position="absolute" top={0} right={0} onPress={() => setShowDeleteModal(false)}>
                        <Icon name="close" size={24} color="gray" />
                    </Modal.CloseButton>
                    <Modal.Header>Excluir Contato</Modal.Header>
                    <Modal.Body>
                        <Text>Deseja realmente excluir este contato?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Box flexDirection="row" justifyContent="flex-end">
                            <Button variant="ghost" onPress={() => setShowDeleteModal(false)}>
                                Cancelar
                            </Button>
                            <Button colorScheme="danger" onPress={handleExcluirContato}>
                                Excluir
                            </Button>
                        </Box>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </NativeBaseProvider>
    );
};

export default Busca;
