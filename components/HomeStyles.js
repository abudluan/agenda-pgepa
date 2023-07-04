import styled from 'styled-components/native';

export const Container = styled.View`
    height: 100%;
    background-color: #FFFFFF;
`;

export const HeaderApp = styled.View`
    margin-top: 20px;
    align-items:center;
    
`;

export const ImgHeader = styled.Image`
    height: 50px;
    width: 50px;
`;

export const TextHeader = styled.Text`
    font-size: 38px;
    margin: auto;
    font-weight: bold;
    
`;

export const InputSearch = styled.TextInput`
    margin-top: 45px;
    width: 95%;
    height: 40px;
    padding-left: 10px;
    border-radius:5px;
    background-color: #008000;
    color: white;
`;

export const BodyApp = styled.View`
    align-items: center;
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
    padding-bottom: 5px;
    border-bottom-width: 2px;
    border-bottom-color: #2E8B57;
`;

export const TitleCard = styled.Text`
    padding-left: 20px;
    margin-top: 20px;
    font-size: 20px;
`;

export const PessoaCard = styled.Text`
    padding-left: 20px;
    margin-top: 20px;
    font-size: 20px;
`;

export const RamalCard = styled.Text`
    padding-left: 20px;
    margin-top: 20px;
    font-size: 20px;
`;

export const SearchNotFound = styled.Text`
    margin-top: 25%;
`;