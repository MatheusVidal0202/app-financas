import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import "./styles";
import Header from "../../components/Header";
import { Background, Input, SubmitButton, SubmitText } from "./styles";
import Picker from "../../components/Picker";
import firebase from "../../services/FirebaseConnection";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../../contexts/auth';
import { useContext } from "react";

export default function New() {
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState(null);
  const navigation = useNavigation();
  const { user: usuario } = useContext(AuthContext);

  function handleSubmit() {
    Keyboard.dismiss();

    if (isNaN(parseFloat(valor)) || tipo === null) {
      alert("Preencha todos os campos!");
      return;
    }

    Alert.alert(
      "Confirmando Dados",
      `Tipo ${tipo} - Valor: ${parseFloat(valor)}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => handleAdd(),
        },
      ]
    );
  }

  async function handleAdd() {
    let uid = usuario.uid;

    let key = await (
      await firebase.database().ref("historico").child(uid).push()
    ).key;
    await firebase
      .database()
      .ref("historico")
      .child(uid)
      .child(key)
      .set({
        tipo: tipo,
        valor: parseFloat(valor),
        data: format(new Date(), "dd/MM/yyyy"), //05/20/21 - //05/20/2021
      });

    //Atualizar o saldo
    let user = firebase.database().ref("users").child(uid);
    await user.once("value").then((snapshot) => {
      let saldo = parseFloat(snapshot.val().saldo);

      tipo === "despesa"
        ? (saldo -= parseFloat(valor))
        : (saldo += parseFloat(valor));

      user.child("saldo").set(saldo);
    });

    setValor("");
    Keyboard.dismiss();
    navigation.navigate("Home");
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Background>
        <Header />

        <SafeAreaView style={{ alignItems: "center" }}>
          <Input
            placeholder="Valor desejado"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={valor}
            onChangeText={(text) => setValor(text)}
          />

          <Picker onChange={setTipo} />
          <SubmitButton onPress={handleSubmit}>
            <SubmitText>Registrar</SubmitText>
          </SubmitButton>
        </SafeAreaView>
      </Background>
    </TouchableWithoutFeedback>
  );
}
