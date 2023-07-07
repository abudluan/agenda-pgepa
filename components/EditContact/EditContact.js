import React, { useState, useEffect } from "react";
import { NativeBaseProvider, Toast } from "native-base";
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
    const { setorId, gerenteId } = route.params;
    const [contato, setContato] = useState(null);
    const [title, setTitle] = useState('');
    const [sigla, setSigla] = useState('');
    const [nome, setNome] = useState('');
    const [ramal, setRamal] = useState('');


    useEffect(() => {
        const fetchContato = async () => {
            try {
                const setorDocRef = doc(db, 'setores', setorId);
                const setorDocSnap = await getDoc(setorDocRef);
                if (setorDocSnap.exists()) {
                    const setorData = setorDocSnap.data();
                    setTitle(setorData.title);
                    setSigla(setorData.sigla);
                }

                const gerenteDocRef = doc(db, 'setores', setorId, 'gerentes', gerenteId);
                const gerenteDocSnap = await getDoc(gerenteDocRef);
                if (gerenteDocSnap.exists()) {
                    const gerenteData = gerenteDocSnap.data();
                    setNome(gerenteData.nome);
                    setRamal(gerenteData.ramal);
                }
            } catch (error) {
                console.error('Erro ao buscar o contato:', error);
            }
        };

        fetchContato();
    }, [setorId, gerenteId]);

    const handleUpdateContact = async () => {
        try {
            const docRef = doc(db, 'setores', setorId, 'gerentes', gerenteId);
            await updateDoc(docRef, {
                title,
                sigla,
                nome,
                ramal,
            });

            // Exibir mensagem de sucesso
            alert('Contato atualizado com sucesso');

            // Redirecionar para a tela Home
            navigation.navigate('Home');
        } catch (error) {
            console.error('Erro ao atualizar o contato:', error);
            // Exibir mensagem de erro
            alert('Ocorreu um erro ao atualizar o contato. Por favor, tente novamente mais tarde.');
        }
    };

    return (
        <NativeBaseProvider>
            <Container>
                <ScrollView>

                    <TitleEdit>Setor</TitleEdit>

                    <ContactEdit
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TitleEdit>Sigla</TitleEdit>

                    <ContactEdit
                        value={sigla} onChangeText={setSigla} />

                    <TitleEdit>Nome(s)</TitleEdit>

                    <ContactEdit
                        value={nome} onChangeText={setNome} />

                    <TitleEdit>Ramal</TitleEdit>

                    <ContactEdit
                        value={ramal} onChangeText={setRamal} />

                    <BtnEdit onPress={handleUpdateContact}>Atualizar</BtnEdit>


                </ScrollView>
            </Container>
        </NativeBaseProvider>
    );
}

export default EditContact;