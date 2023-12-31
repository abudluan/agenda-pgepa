import styled from 'styled-components/native';
import { Button } from 'native-base';

export const Container = styled.View`
    height: 100%;
    background-color: #FFFFFF;
`;

export const HeaderApp = styled.View`
    align-items:center;
    background-color: #008000;
    padding-top: 20px;
`;

export const ImgHeader = styled.Image`
    height: 30px;
    width: 30px;
`;

export const TextHeader = styled.Text`
    height: 50px;
    color: white;
    font-size: 24px;
    margin: auto;
    font-weight: bold;
`;

export const HeaderConfigView = styled.View`
    flex-direction: row;
    width: 95%;
    justify-content: flex-end;
    padding-bottom: 15px;
`;

export const BodyApp = styled.View`
    align-items: center;
`;

export const CardControl = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;

export const AvatarProfile = styled.Image`
    position: absolute;
    margin-left: 15px;
    margin-top: 9px;
    height: 40px;
    width: 40px;
    border-radius: 50px;
`;

export const BtnLogin = styled(Button)`
background-color: #008000;
`;

export const CardBody = styled.View`
    margin-top: 20px;
    margin-bottom: 10px;
    border-radius: 5px;
    padding-bottom: 20px;
    width: 95%;
    background-color: #C4E9FF;
`;

export const SiglaCard = styled.Text`
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    padding-top: 10px;
    padding-bottom: 15px;
    border-bottom-width: 2px;
    border-bottom-color: #2E8B57;
`;

export const TitleCard = styled.Text`
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 20px;
    font-size: 20px;
`;

export const PessoaCard = styled.Text`
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 20px;
    font-size: 20px;
`;

export const RamalCard = styled.Text`
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 20px;
    font-size: 20px;
`;

export const SearchNotFound = styled.Text`
    margin-top: 25%;
`;