import styled from "styled-components";
import { Button } from "native-base";

export const Container = styled.View`
    height: 100%;
    background-color: #FFFFFF;
    
`;

export const TitleInput = styled.Text`
    margin-top: 50px;
    margin-left: 50px;
    margin-bottom: 5px;
    color: black;
    font-size: 20px;
    text-align: left;
`;

export const ContactInput = styled.TextInput`
    width: 75%;
    height: 40px;
    margin: auto;
    padding-left: 10px;
    padding-right: 10px;
    border-radius:5px;
    background-color: #008000;
    color: white;
`;

export const BtnCadastro = styled(Button)`
    margin: auto;
    margin-top: 50px;
    margin-bottom: 15px;
    width: 50%;
    background-color: #008000;

`;
