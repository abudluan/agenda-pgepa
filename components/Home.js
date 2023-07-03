import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, ActivityIndicator, View, StatusBar, TouchableOpacity } from 'react-native';
import { getDocs, collection, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Container,
  HeaderApp,
  ImgHeader,
  TextHeader,
  InputSearch,
  ClearSearch,
  BodyApp,
  CardBody,
  SiglaCard,
  TitleCard,
  PessoaCard,
  RamalCard,
  SearchNotFound,
} from './HomeStyles';

import Logo from '../src/brasao.png';

const Home = () => {
  const [setores, setSetores] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredSetores, setFilteredSetores] = useState([]);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <Container>
      <StatusBar backgroundColor="#008000" barStyle="light-content" />
      <HeaderApp>
        <TextHeader>
          <ImgHeader source={Logo} />
          Agenda PGE/PA
        </TextHeader>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InputSearch
            placeholder="Digite sua pesquisa..."
            placeholderTextColor="#fff"
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
          />
          {searchValue !== '' && (
            <TouchableOpacity onPress={handleClearSearch} style={{ position: 'absolute', right: 10, top: 37 }}>
              <Icon2 name="close" size={24} color="white" />
            </TouchableOpacity>
          )}
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
                      <SiglaCard>{setor.sigla}</SiglaCard>
                      <TitleCard>
                        <Icon name="office-building-marker" size={30} color="#008000" /> {setor.title}
                      </TitleCard>
                      <PessoaCard>
                        <Icon name="account-group" size={30} color="#008000" /> Responsável: {gerente.nome}
                      </PessoaCard>
                      <RamalCard>
                        <Icon name="phone" size={30} color="#008000" /> Ramal: {gerente.ramal}
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
  );
}

export default Home;
