import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  StateValueEmitter,
  useValueEmitter,
  ValueEmitter,
} from '../../src/index';

const valueEmitter = new ValueEmitter<number>();
const stateValueEmitter = new StateValueEmitter<number>(1);

function ValueView() {
  const [value, setValue] = useState<number>();

  useValueEmitter((v) => {
    setValue(v);
  }, valueEmitter);

  return (
    <>
      <Text style={styles.title}>ValueEmitter</Text>
      <Text>Value: {value ? value : 'null'}</Text>
      <Button
        title="Increment"
        onPress={() => {
          valueEmitter.add((value ?? 0) + 1);
        }}
      />
    </>
  );
}

function StateValueView() {
  const [value, setValue] = useState<number>(stateValueEmitter.value);

  useValueEmitter((v) => {
    setValue(v);
  }, stateValueEmitter);

  return (
    <>
      <Text style={styles.title}>StateValueEmitter</Text>
      <Text>Value: {value}</Text>
      <Button
        title="Increment"
        onPress={() => {
          stateValueEmitter.add(value + 1);
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <ValueView />
      <StateValueView />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
