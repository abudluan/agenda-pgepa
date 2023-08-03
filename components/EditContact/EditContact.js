import React, { useState, useEffect } from "react";
import { NativeBaseProvider, Toast, Spinner } from "native-base";
import { ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {
    Container,
    TitleEdit,
    ContactEdit,
    BtnEdit
} from "./EditContactStyles";

const EditContact = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { setorId } = route.params;
    const [title, setTitle] = useState('');
    const [sigla, setSigla] = useState('');
    const [nome, setNome] = useState('');
    const [ramal, setRamal] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSetor = async () => {
            try {
                const setorDocRef = doc(db, 'setores', setorId);
                const setorDocSnap = await getDoc(setorDocRef);
                if (setorDocSnap.exists()) {
                    const setorData = setorDocSnap.data();
                    setTitle(setorData.title);
                    setSigla(setorData.sigla);
                    setNome(setorData.nome);
                    setRamal(setorData.ramal);
                }
            } catch (error) {
                console.error('Erro ao buscar o setor:', error);
            }
        };

        fetchSetor();
    }, [setorId]);

    const handleUpdateSetor = async () => {
        try {
            const docRef = doc(db, 'setores', setorId);

            await updateDoc(docRef, {
                title,
                sigla,
                nome,
                ramal,
            });

            setLoading(true);
            
            navigation.navigate('Home');
            

        } catch (error) {
            console.error('Erro ao atualizar o setor:', error);
            // Exibir mensagem de erro
            Toast.show({
                title: 'Erro ao atualizar',
                description: 'Ocorreu um erro ao atualizar o setor. Por favor, tente novamente mais tarde.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <NativeBaseProvider>
            <Container>
                <ScrollView>
                    <TitleEdit>Setor</TitleEdit>
                    <ContactEdit selectionColor="white" value={title} onChangeText={setTitle} />

                    <TitleEdit>Sigla</TitleEdit>
                    <ContactEdit selectionColor="white" value={sigla} onChangeText={setSigla} />

                    <TitleEdit>Nome(s)</TitleEdit>
                    <ContactEdit selectionColor="white" value={nome} onChangeText={setNome} />

                    <TitleEdit>Ramal</TitleEdit>
                    <ContactEdit selectionColor="white" keyboardType="numeric" value={ramal} onChangeText={setRamal} />

                    <BtnEdit onPress={handleUpdateSetor} disabled={loading}>
                    {loading ? <Spinner color="white" /> : 'Atualizar'}
                    </BtnEdit>
                </ScrollView>
            </Container>
        </NativeBaseProvider>
    );
}

export default EditContact;