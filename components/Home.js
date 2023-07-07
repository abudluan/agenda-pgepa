import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ClearIcon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeBaseProvider, Modal, FormControl, Input, Button, Toast, Spinner, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { getDocs, collection, query, doc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import {
  Container,
  HeaderApp,
  ImgHeader,
  TextHeader,
  InputSearch,
  BodyApp,
  CardBody,
  SiglaCard,
  TitleCard,
  PessoaCard,
  RamalCard,
  SearchNotFound,
  CardControl,
  TextCardControl,
  BtnLogin
} from './HomeStyles';

import Logo from '../src/brasao.png';

const Home = () => {
  const [setores, setSetores] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredSetores, setFilteredSetores] = useState([]);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchSetores = async () => {
      try {
        setLoading(true);

        const setoresSnapshot = await getDocs(collection(db, 'setores'));
        const setoresData = setoresSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          sigla: doc.data().sigla,
          gerentes: [],
        }));

        await Promise.all(
          setoresData.map(async (setor) => {
            const gerentesSnapshot = await getDocs(query(collection(db, 'setores', setor.id, 'gerentes')));
            const gerentesData = gerentesSnapshot.docs.map((doc) => ({
              id: doc.id,
              nome: doc.data().nome,
              ramal: doc.data().ramal,
            }));
            setor.gerentes = gerentesData;
          })
        );

        setSetores(setoresData);
        setFilteredSetores(setoresData);
        setLoading(false);
      } catch (error) {
        console.log('Erro ao buscar os setores:', error);
        setLoading(false);
      }
    };

    fetchSetores();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  const handleSearch = () => {
    const formattedSearchValue = searchValue.toLowerCase();

    if (formattedSearchValue === '') {
      setFilteredSetores(setores);
      setSearchNotFound(false);
    } else {
      const filteredSetores = setores.map((setor) => {
        const filteredGerentes = setor.gerentes.filter((gerente) => {
          const formattedNome = gerente.nome.toLowerCase();
          const formattedRamal = gerente.ramal.toLowerCase();
          const formattedSigla = setor.sigla.toLowerCase();
          const formattedTitle = setor.title.toLowerCase();

          return (
            formattedNome.includes(formattedSearchValue) ||
            formattedSigla.includes(formattedSearchValue) ||
            formattedTitle.includes(formattedSearchValue) ||
            formattedRamal.includes(formattedSearchValue)
          );
        });

        return {
          ...setor,
          gerentes: filteredGerentes,
        };
      });

      setFilteredSetores(filteredSetores);
      setSearchNotFound(filteredSetores.every((setor) => setor.gerentes.length === 0));
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

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

  const handleLogin = () => {
    setLoading(true);
    if (!email || !password) {
      Toast.show({
        title: 'Campos vazios',
        description: 'Por favor, preencha todos os campos.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      setLoading(false);;
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuário logado:', userCredential.user);
        setIsUserLoggedIn(true);
        AsyncStorage.setItem('isUserLoggedIn', 'true')
          .then(() => {
            console.log('Estado de autenticação armazenado com sucesso.');
          })
          .catch((error) => {
            console.log('Erro ao armazenar o estado de autenticação:', error);
          });
        setShowModal(false);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro de autenticação:', error.message);
        Toast.show({
          title: 'Erro de autenticação',
          description: 'Credenciais inválidas. Por favor, verifique suas informações de login.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      });
  };

  const handleLogout = () => {
    setIsUserLoggedIn(false);
    AsyncStorage.removeItem('isUserLoggedIn')
      .then(() => {
        console.log('Estado de autenticação removido com sucesso.');
      })
      .catch((error) => {
        console.log('Erro ao remover o estado de autenticação:', error);
      });
    setShowModal(false);
  };

  const handleSelectContact = (setorId, contatoId) => {
    setSelectedContact({ setorId, contatoId });
    setShowDeleteModal(true);
  };

  const handleExcluirContato = async () => {
    try {
      if (selectedContact) {
        const { setorId, contatoId } = selectedContact;
        // Excluir o documento do contato
        await deleteDoc(doc(db, 'setores', setorId, 'gerentes', contatoId));
        // Exibir mensagem de sucesso
        Toast.show({
          title: 'Contato excluído',
          description: 'O contato foi excluído com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Fechar o modal e redefinir o contato selecionado
        setShowDeleteModal(false);
        setSelectedContact(null);
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

  const handleEditContact = (setorId, gerenteId) => {
    navigation.navigate('EditContact', { setorId, gerenteId });
  };



  return (
    <NativeBaseProvider>
      <Container>
        <HeaderApp>
          <TextHeader>
            <ImgHeader source={Logo} />
            Agenda PGE-PA
          </TextHeader>
          <View style={{ position: 'absolute', right: 16, top: 25 }}>
            {isUserLoggedIn ? (
              <TouchableOpacity onPress={handleLogout}>
                <Icon name="logout" size={30} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleFormLogin}>
                <Icon name="login" size={30} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Login</Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>Email</FormControl.Label>
                    <Input
                      keyboardType="email-address"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                    />
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>Senha</FormControl.Label>
                    <Input
                      secureTextEntry
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                    />
                  </FormControl>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <BtnLogin onPress={handleLogin}>
                      {loading ? <Spinner color="white" /> : 'Entrar'}
                    </BtnLogin>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </View>


        </HeaderApp>

        <View style={{ top: -15, alignItems: 'center' }}>
          <InputSearch
            placeholder="Digite sua pesquisa..."
            placeholderTextColor="#fff"
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
          />
          {searchValue !== '' && (
            <TouchableOpacity onPress={handleClearSearch} style={{ position: 'absolute', right: 20, top: 42 }}>
              <ClearIcon name="close" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView>
          {loading ? (
            <View style={{ padding: 100 }}>
              <ActivityIndicator size="large" color="#008000" />
            </View>
          ) : (
            <BodyApp>
              {isUserLoggedIn && (
                <View style={{ left: 155, top: 0 }}>
                  <TouchableOpacity onPress={() => navigation.navigate('AddContact')}>
                    <Icon name="account-plus" size={30} color="#008000" />
                  </TouchableOpacity>
                </View>
              )}
              {!searchNotFound ? (
                filteredSetores.map((setor) => (
                  <React.Fragment key={setor.id}>
                    {setor.gerentes.map((gerente) => (
                      <CardBody key={gerente.id}>
                        <SiglaCard>{setor.sigla}</SiglaCard>
                        <TitleCard>
                          <Icon name="office-building-marker" size={25} color="#008000" /> {setor.title}
                        </TitleCard>
                        <PessoaCard>
                          <Icon name="account-group" size={25} color="#008000" /> Responsável: {gerente.nome}
                        </PessoaCard>
                        <RamalCard>
                          <Icon name="phone" size={25} color="#008000" /> Ramal: {gerente.ramal}
                        </RamalCard>
                        {isUserLoggedIn && (
                          <CardControl>
                            <TouchableOpacity onPress={() => handleEditContact(setor.id, gerente.id)} style={{ right: 25, top: 10 }}>
                              <Icon name="account-edit" size={30} color="#008000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSelectContact(setor.id, gerente.id)} style={{ right: 15, top: 10 }}>
                              <Icon name="delete" size={30} color="#008000" />
                            </TouchableOpacity>
                          </CardControl>
                        )}
                      </CardBody>
                    ))}
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
}

export default Home;
