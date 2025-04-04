# react-native-value-emitter

Value emitters with or without state.

## Installation

```sh
npm install react-native-value-emitter
```

## Usage

```js
import { StateValueEmitter, ValueEmitter, useValueEmitter, } from 'react-native-value-emitter';

// Create a value emitter with or without state
const valueEmitter = new ValueEmitter<number>();
const valueEmitter = new StateValueEmitter<number>(1);

// Listen to the value emitter
const [value, setValue] = useState<number>();

useValueEmitter((v) => {
  setValue(v);
}, valueEmitter);
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
