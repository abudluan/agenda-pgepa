import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ClearIcon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Modal, FormControl, Input, Button, Toast, Spinner } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { getDocs, collection, query } from 'firebase/firestore';
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
  const [loggingIn, setLoggingIn] = useState(false);


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

  const handleLogin = () => {
    setLoading(true);
    if (!email || !password) {
      Toast.show({
        title: 'Campos vazios',
        description: 'Por favor, preencha todos os campos.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuário logado:', userCredential.user);
        setIsUserLoggedIn(true);
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
      });
  };

  const handleLogout = () => {
    setIsUserLoggedIn(false);
    setShowModal(false);
  };


  return (
    <NativeBaseProvider>
      <Container>
        <HeaderApp>
          <TextHeader>
            <ImgHeader source={Logo} />
            Agenda PGE-PA
          </TextHeader>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <InputSearch
              placeholder="Digite sua pesquisa..."
              placeholderTextColor="#fff"
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
            />
            {searchValue !== '' && (
              <TouchableOpacity onPress={handleClearSearch} style={{ position: 'absolute', right: 10, top: 53 }}>
                <ClearIcon name="close" size={24} color="white" />
              </TouchableOpacity>
            )}
            <View style={{ position: 'absolute', right: 10, top: 2 }}>
              {isUserLoggedIn ? (
                <TouchableOpacity onPress={handleLogout}>
                  <Icon name="logout" size={30} color="#008000" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleFormLogin}>
                  <Icon name="login" size={30} color="#008000" />
                </TouchableOpacity>
              )}
            </View>

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
                    {setor.gerentes.map((gerente) => (
                      <CardBody key={gerente.id}>
                        {isUserLoggedIn && (
                          <CardControl>
                            <TouchableOpacity style={{ right: 30, top: 10 }}>
                              <Icon name="account-edit" size={30} color="#008000" style={{ right: -5 }} />
                              <TextCardControl>Editar</TextCardControl>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ right: 10, top: 10 }}>
                              <Icon name="delete" size={30} color="#008000" style={{ right: -8 }} />
                              <TextCardControl>Apagar</TextCardControl>
                            </TouchableOpacity>
                          </CardControl>
                        )}
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
    </NativeBaseProvider>
  );
}

export default Home;
