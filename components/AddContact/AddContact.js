import React, { useState } from "react";
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { NativeBaseProvider, Toast, Spinner } from "native-base";
import { ScrollView } from 'react-native';
import {
    Container,
    TitleInput,
    ContactInput,
    BtnCadastro
} from "./AddContactStyles";

const AddContact = () => {

    const [title, setTitle] = useState('');
    const [sigla, setSigla] = useState('');
    const [nome, setNome] = useState('');
    const [ramal, setRamal] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCadastro = async () => {
        const trimmedTitle = title.trim();
        const trimmedSigla = sigla.trim();
        const trimmedNome = nome.trim();
        const trimmedRamal = ramal.trim();

        // Verifique se todos os campos foram preenchidos
        if (!trimmedTitle || !trimmedSigla || !trimmedNome || !trimmedRamal) {
            Toast.show({
                title: 'Campos vazios',
                description: 'Por favor, preencha todos os campos.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        try {
            // Verifique se o nome já existe
            const nomeQuery = query(collection(db, 'setores'), where('nome', '==', trimmedNome));
            const nomeQuerySnapshot = await getDocs(nomeQuery);

            if (!nomeQuerySnapshot.empty) {
                Toast.show({
                    title: 'Nome já existe',
                    description: 'O nome informado já está cadastrado.',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });
                setLoading(false);
                return;
            }

            const setorData = {
                title: trimmedTitle,
                sigla: trimmedSigla,
                nome: trimmedNome,
                ramal: trimmedRamal,
            };

            const docRef = await addDoc(collection(db, 'setores'), setorData);

            Toast.show({
                title: 'Cadastro realizado',
                description: 'O setor foi cadastrado com sucesso.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            setTitle('');
            setSigla('');
            setNome('');
            setRamal('');
            setLoading(false);
        } catch (error) {
            console.error('Erro ao cadastrar setor:', error);

            Toast.show({
                title: 'Erro ao cadastrar',
                description: 'Ocorreu um erro ao cadastrar o setor. Por favor, tente novamente mais tarde.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
        }
    };

    return (
        <NativeBaseProvider>
            <Container>
                <ScrollView>
                    <TitleInput>Setor</TitleInput>
                    <ContactInput
                        placeholder="Digite o nome completo do setor"
                        placeholderTextColor="#fff"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TitleInput>Sigla</TitleInput>
                    <ContactInput
                        placeholder="Digite somente a sigla do setor"
                        placeholderTextColor="#fff"
                        autoCapitalize="characters"
                        value={sigla}
                        onChangeText={setSigla}
                    />

                    <TitleInput>Nome(s)</TitleInput>
                    <ContactInput
                        placeholder="Informe o nome do(s) responsável(eis)"
                        placeholderTextColor="#fff"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <TitleInput>Ramal</TitleInput>
                    <ContactInput
                        placeholder="Informe o ramal do setor"
                        placeholderTextColor="#fff"
                        keyboardType="numeric"
                        value={ramal}
                        onChangeText={setRamal}
                    />

                    <BtnCadastro onPress={handleCadastro}>
                    {loading ? <Spinner color="white" /> : 'Cadastrar'}
                    </BtnCadastro>
                </ScrollView>
            </Container>
        </NativeBaseProvider>
    );
}

export default AddContact;
