import styled from "styled-components";
import { Button } from "native-base";

export const Container = styled.View`
    height: 100%;
    background-color: #FFFFFF;
    align-items:center;
`;

export const TitleInputLogin = styled.Text`
    margin-top: 120px;
    margin-bottom: 5px;
    color: black;
    font-size: 20px;
    text-align: left;
`;

export const InputLogin = styled.TextInput`
    width: 80%;
    height: 40px;
    padding-left: 10px;
    border-radius:5px;
    background-color: #008000;
    color: white;
`;

export const TitleInputPass = styled.Text`
    margin-top: 40px;
    margin-bottom: 5px;
    color: black;
    font-size: 20px;
`;

export const InputPass = styled.TextInput`
    width: 80%;
    height: 40px;
    padding-left: 10px;
    border-radius:5px;
    background-color: #008000;
    color: white;
`;

export const BtnLogin = styled(Button)`
  margin-top: 50px;
  width: 180px;
  background-color: #008000;

`;