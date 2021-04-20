import React from "react";
import { PickerView } from "./styles";
import { Picker as RNPickerSelect } from "@react-native-picker/picker";

export default function Picker( { onChange, tipo} ) {
  return (
    <PickerView>
      <RNPickerSelect
        style={{
          width: "100%",
        }}
        selectedValue={tipo}
        onValueChange={(valor) => onChange(valor)}
      >
        <RNPickerSelect.Item label="Selecione um tipo" value="vazio"/>
        <RNPickerSelect.Item label="Receita" value="receita"/>
        <RNPickerSelect.Item label="Despesa" value="despesa"/>
      </RNPickerSelect>
    </PickerView>
  );
}
