import React, { useContext, useState, useEffect } from "react";
import { View, Text, Button, Alert, TouchableOpacity, Platform } from "react-native";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import { Background, Container, Nome, Saldo, Title, List, Area } from "./styles";
import HistoricoList from "../../components/HistoricoList";
import firebase from "../../services/FirebaseConnection";
import { format, isBefore } from "date-fns";
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePicker';

export default function Home() {
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const { user } = useContext(AuthContext);
  const uid = user && user.uid;
  const [newData, setNewData] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function loadList() {
      await firebase
        .database()
        .ref("users")
        .child(uid)
        .on("value", (snapshot) => {
          setSaldo(snapshot.val().saldo);
        });

      await firebase
        .database()
        .ref("historico")
        .child(uid)
        .orderByChild("data")
        .equalTo(format(newData, "dd/MM/yyyy"))
        .limitToLast(10)
        .on("value", (snapshot) => {
          setHistorico([]);
          snapshot.forEach((childItem) => {
            let list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
              data: childItem.val().data,
            };

            setHistorico((oldArray) => [...oldArray, list].reverse());
          });
        });
    }

    loadList();
  }, [newData]);

  function handleDelete(data) {

    const [diaItem, mesItem, anoItem] = data.data.split('/');
    const dataItem = new Date(`${anoItem}/${mesItem}/${diaItem}}`);
    console.log(dataItem);

    //Pegando data de hoje
    const formartDataHoje = format(new Date(), 'dd/MM/yyyy');
    const [diaHoje, mesHoje, anoHoje] =  formartDataHoje.split('/');
    const dataHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}}`);
    console.log(dataHoje);

    if (isBefore(dataItem, dataHoje)) {
      //Se a data registro ja passou ele cai aqui
      alert("Você não pode excluir um registro antigo!");
      return;
    }

    Alert.alert(
      "Cuidado Atenção",
      `Você desejá excluir ${data.tipo} - Valor: R$ ${data.valor}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => handleDeleteSucess(data),
        },
      ]
    );
  }

  async function handleDeleteSucess(data) {
    await firebase
      .database()
      .ref("historico")
      .child(uid)
      .child(data.key)
      .remove()
      .then(async () => {
        let saldoAtual = saldo;
        data.tipo === "despesa"
          ? (saldoAtual += parseFloat(data.valor))
          : (saldoAtual -= parseFloat(data.valor));

        await firebase
          .database()
          .ref("users")
          .child(uid)
          .child("saldo")
          .set(saldoAtual);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleShowPicker(){
    setShow(true);
  }

  function handleClose(){
    setShow(false);
  }

  const onChange = (date) => {
    setShow(Platform.OS === 'ios');
    setNewData(date);
    console.log(">>>>>" + date);
  }
  
  return (
    <Background>
      <Header />
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>
          R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
        </Saldo>
      </Container>

      <Area>
      <TouchableOpacity onPress={handleShowPicker}>
        <Icon name="event" color="#fff" size={30} />
      </TouchableOpacity>
      <Title>Ultimas movimentações</Title>
      </Area>
    
      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <HistoricoList data={item} deleteItem={handleDelete} />
        )}
      />

      {show && (
        <DatePicker 
          oncClose={handleClose}
          date={newData}
          onChange={onChange}
        />
      )}
    </Background>
  );
}
