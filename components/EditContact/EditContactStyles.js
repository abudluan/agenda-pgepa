import styled from "styled-components";
import { Button } from "native-base";

export const Container = styled.View`
    height: 100%;
    background-color: #FFFFFF;
    
`;

export const TitleEdit = styled.Text`
    margin-top: 50px;
    margin-left: 20px;
    margin-bottom: 5px;
    color: black;
    font-size: 20px;
    text-align: left;
`;

export const ContactEdit = styled.TextInput`
    width: 90%;
    height: 40px;
    margin-left: 20px;
    padding-left: 10px;
    border-radius:5px;
    background-color: #008000;
    color: white;
`;

export const BtnEdit = styled(Button)`
    margin: auto;
    margin-top: 50px;
    margin-bottom: 15px;
    width: 50%;
    background-color: #008000;

`;
