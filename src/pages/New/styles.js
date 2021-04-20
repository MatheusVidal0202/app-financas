import styled from 'styled-components/native';

export const Background = styled.View`
    flex: 1;
    background-color: #131313;
`;

export const Input = styled.TextInput.attrs({
    placeholderTextColor: '#222'
})`
    height: 50px;
    width: 90%;
    background-color: rgba(255,255,255, 0.8);
    margin-top: 30px;
    font-size: 17px;
    border-radius: 10px;
`;

export const SubmitButton = styled.TouchableOpacity`
    height: 50px;
    width: 90%;
    margin-top: 20px;
    align-items: center;
    justify-content: center;
    background-color: #00b94a;
    border-radius: 10px;
`;

export const SubmitText = styled.TextInput`
    font-size: 21px;
    font-weight: bold;
    color: #fff;
`;