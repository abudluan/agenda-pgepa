import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert } from 'react-native';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Text } from "react-native";
import { NativeBaseProvider, Button, Modal, Box } from 'native-base';
import * as appJson from '../app.json';

const VerifyVersion = () => {
    const [loading, setLoading] = useState(true);
    const [serverVersion, setServerVersion] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();
    const currentVersion = appJson.expo.version;

    useEffect(() => {
        checkAppVersion();
    }, []);

    const checkAppVersion = async () => {
        try {
            const versionSnapshot = await getDoc(
                doc(collection(db, "version"), "ZNjkSaZp7AK27IhKcVCd")
            );
            if (versionSnapshot.exists()) {
                const versionData = versionSnapshot.data();
                setServerVersion(versionData.update);

                if (currentVersion !== versionData.update) {
                    setShowModal(true);
                } else {
                    navigation.navigate("Home");
                    console.log("Aplicativo está na última versão");
                }
            } else {
                console.log("Versão do aplicativo não encontrada no Firestore.");
            }
        } catch (error) {
            console.log("Erro ao verificar a versão do aplicativo:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateApp = () => {
        navigation.navigate('Home');
    };


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#008000" />
                <Text>Verificando versão do aplicativo</Text>
            </View>
        );
    }

    return (
        <NativeBaseProvider>
            <View style={{ flex: 1 }}>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content>
                        <Modal.Header>Aplicativo Desatualizado</Modal.Header>
                        <Modal.Body>
                            <Text>
                                Uma nova versão do aplicativo está disponível. Por favor, atualize para continuar usando.
                            </Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Box flexDirection="row" justifyContent="flex-end">
                                <Button variant="ghost" onPress={handleUpdateApp}>
                                    Atualizar
                                </Button>
                            </Box>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </View>
        </NativeBaseProvider>
    );
};

export default VerifyVersion;