import React, { useState } from "react";
import { NativeBaseProvider } from "native-base";
import { ScrollView } from 'react-native';
import {
    Container,
    TitleInput,
    ContactInput,
    BtnCadastro
}
    from "./EditCardStyles";

const EditCard = () => {

    

    return (
        <NativeBaseProvider>
            <Container>

                <ScrollView>

                    <TitleInput>Setor</TitleInput>
                    <ContactInput
                        placeholder="Digite o nome completo do setor"
                        placeholderTextColor="#fff"
                    />

                    <TitleInput>Sigla</TitleInput>
                    <ContactInput
                        placeholder="Digite somente a sigla do setor"
                        placeholderTextColor="#fff"
                    />

                    <TitleInput>Nome(s)</TitleInput>
                    <ContactInput
                        placeholder="Informe o nome do(s) responsável(eis)"
                        placeholderTextColor="#fff"
                    />

                    <TitleInput>Ramal</TitleInput>
                    <ContactInput
                        placeholder="Informe o ramal do setor"
                        placeholderTextColor="#fff"
                        keyboardType="numeric"
                    />

                    <BtnCadastro>Cadastrar</BtnCadastro>

                </ScrollView>
            </Container>
        </NativeBaseProvider>
    );
}

export default EditCard;