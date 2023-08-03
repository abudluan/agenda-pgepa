import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, ActivityIndicator, View, TouchableOpacity, Text, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeBaseProvider, Modal, FormControl, Input, Button, Toast, Spinner, Box } from 'native-base';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import SearchIcon from 'react-native-vector-icons/Feather';
import AddContactIcon from 'react-native-vector-icons/AntDesign';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import {
  Container,
  HeaderApp,
  ImgHeader,
  TextHeader,
  HeaderConfigView,
  BodyApp,
  CardBody,
  AvatarProfile,
  SiglaCard,
  TitleCard,
  PessoaCard,
  RamalCard,
  SearchNotFound,
  CardControl,
} from './HomeStyles';

import Logo from '../src/brasao.png';
import AvatarPhoto from '../src/avatarProfile.png';

import LoginModal from './LoginModal.js/LoginModal';
import Busca from './Busca/Busca';

const Home = () => {
  const [setores, setSetores] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredSetores, setFilteredSetores] = useState([]);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchSetores();
    }
  }, [isFocused]);

  const fetchSetores = async () => {
    try {
      setLoading(true);

      const setoresSnapshot = await getDocs(collection(db, 'setores'));
      const setoresData = setoresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSetores(setoresData);
      setFilteredSetores(setoresData);
      setLoading(false);
    } catch (error) {
      console.log('Erro ao buscar os setores:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetores();


    const interval = setInterval(() => {
      fetchSetores();
    }, 3600000);


    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleFormLogin = () => {
    setShowModal(true);
  };

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isUserLoggedIn');
      if (value === 'true') {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    } catch (error) {
      console.log('Erro ao verificar o estado de autenticação:', error);
    }
  };

  const handleLogout = async () => {
    setIsUserLoggedIn(false);
    await AsyncStorage.removeItem('isUserLoggedIn');
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

  const handlePesquisa = () => {
    navigation.navigate('Busca', { setores: setores });
  };

  const handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => backHandler.remove();
  }, []);

  return (
    <NativeBaseProvider>
      <Container>
        <HeaderApp>
          <TextHeader>
            <ImgHeader source={Logo} />
            Agenda PGE-PA
          </TextHeader>

          <HeaderConfigView>
            {isUserLoggedIn && (
              <TouchableOpacity style={{ right: 30 }} onPress={() => navigation.navigate('AddContact')}>
                <AddContactIcon name="plus" size={27} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity>

              <TouchableOpacity onPress={handlePesquisa} style={{ right: 20 }}>
                <SearchIcon name="search" size={25} color="white" />
              </TouchableOpacity>


            </TouchableOpacity>
            {isUserLoggedIn ? (
              <TouchableOpacity style={{ right: 5 }} onPress={handleLogout}>
                <Icon name="logout" size={27} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{ right: 5 }} onPress={handleFormLogin}>
                <Icon name="login" size={27} color="white" />
              </TouchableOpacity>
            )}
          </HeaderConfigView>

          <LoginModal
            showModal={showModal}
            setShowModal={setShowModal}
            setIsUserLoggedIn={setIsUserLoggedIn}
          />
        </HeaderApp>

        <ScrollView>
          {loading ? (
            <View style={{ padding: 100 }}>
              <ActivityIndicator size="large" color="#008000" />
            </View>
          ) : (
            <BodyApp>
              {!searchNotFound ? (
                filteredSetores.map((setor) => (
                  <React.Fragment key={setor.id}>
                    <CardBody key={setor.id}>
                      <SiglaCard>{setor.sigla}</SiglaCard>
                      <AvatarProfile source={AvatarPhoto} resizeMode="contain" />
                      <TitleCard>
                        <Icon name="office-building-marker" size={25} color="#008000" /> {setor.title}
                      </TitleCard>
                      <PessoaCard>
                        <Icon name="account-group" size={25} color="#008000" /> Responsável: {setor.nome}
                      </PessoaCard>
                      <RamalCard>
                        <Icon name="phone" size={25} color="#008000" /> Ramal: {setor.ramal}
                      </RamalCard>
                      {isUserLoggedIn && (
                        <CardControl>
                          <TouchableOpacity onPress={() => handleEditContact(setor.id)} style={{ right: 25, top: 10 }}>
                            <Icon name="account-edit" size={30} color="#008000" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleSelectContact(setor.id)} style={{ right: 15, top: 10 }}>
                            <Icon name="delete" size={30} color="#008000" />
                          </TouchableOpacity>
                        </CardControl>
                      )}
                    </CardBody>
                  </React.Fragment>
                ))
              ) : (
                <SearchNotFound>Nenhum resultado encontrado.</SearchNotFound>
              )}
            </BodyApp>
          )}
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

export default Home;