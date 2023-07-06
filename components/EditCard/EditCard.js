import React, { useState } from "react";
import { NativeBaseProvider } from "native-base";
import {
    Container,
    TitleInputLogin,
    TitleInputPass,
    InputLogin,
    InputPass,
    BtnLogin
}
    from "./EditCardStyles";

const EditCard = () => {

    const [showModal, setShowModal] = useState(false);

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

export default EditCard;