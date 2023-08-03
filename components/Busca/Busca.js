import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ClearIcon from 'react-native-vector-icons/MaterialIcons';

import {
    Container,
    SearchInput,

} from './BuscaStyles';

const Busca = () => {
    const [searchValue, setSearchValue] = useState('');

    return (
        <Container>
            <SearchInput
                placeholder="Digite sua pesquisa..."
                placeholderTextColor="#fff"
                selectionColor="white"
            />

            <ScrollView>

            </ScrollView>

        </Container>
    )
};

export default Busca;