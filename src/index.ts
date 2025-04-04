import EventEmitter, {
  type EmitterSubscription,
} from 'react-native/Libraries/vendor/emitter/EventEmitter';

export class ValueEmitter<T> extends EventEmitter {
  constructor() {
    super();
  }

  add(v: T) {
    this.emit('value', v);
  }

  onValue: (handler: (v: T) => void) => EmitterSubscription = (handler) => {
    return this.addListener('value', handler);
  };

  map: <U>(mapping: (v: T) => U) => ValueEmitter<U> = <U>(
    mapping: (v: T) => U
  ) => {
    const emitter = new ValueEmitter<U>();
    this.onValue((v) => {
      emitter.add(mapping(v));
    });
    return emitter;
  };
}

export class StateValueEmitter<T> extends ValueEmitter<T> {
  constructor(initialValue: T | undefined = undefined) {
    super();
    this.value = initialValue;
  }

  add(v: T) {
    this.value = v;
    super.add(v);
  }

  value: T | undefined;

  map: <U>(mapping: (v: T) => U) => StateValueEmitter<U> = <U>(
    mapping: (v: T) => U
  ) => {
    const emitter = new StateValueEmitter<U>(
      this.value !== undefined ? mapping(this.value) : undefined
    );
    this.onValue((v) => {
      emitter.add(mapping(v));
    });
    return emitter;
  };
}
