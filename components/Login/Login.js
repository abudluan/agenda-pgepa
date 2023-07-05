import React, { useState } from "react";
import { NativeBaseProvider } from "native-base";
import { TouchableOpacity } from "react-native";
import {
    Container,
    TitleInputLogin,
    TitleInputPass,
    InputLogin,
    InputPass,
    BtnLogin
}
    from "./LoginStyles";

const Login = () => {



    return (
        <NativeBaseProvider>
            <Container>

                <TitleInputLogin>Email</TitleInputLogin>

                <InputLogin
                    keyboardType="email-address"
                />

                <TitleInputPass>Senha</TitleInputPass>

                <InputPass
                    secureTextEntry
                />


                <BtnLogin>Entrar</BtnLogin>


            </Container>
        </NativeBaseProvider>
    );
}

export default Login;