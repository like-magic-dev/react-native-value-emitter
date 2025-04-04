import { useEffect } from 'react';
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
  constructor(initialValue: T) {
    super();
    this.value = initialValue;
  }

  add(v: T) {
    this.value = v;
    super.add(v);
  }

  value: T;

  map: <U>(mapping: (v: T) => U) => StateValueEmitter<U> = <U>(
    mapping: (v: T) => U
  ) => {
    const emitter = new StateValueEmitter<U>(mapping(this.value));
    this.onValue((v) => {
      emitter.add(mapping(v));
    });
    return emitter;
  };
}

export const useValueEmitter = <T>(
  action: (value: T) => void,
  emitter: ValueEmitter<T>
): void => {
  useEffect(() => {
    const subscription = emitter.onValue(action);
    return () => {
      subscription.remove();
    };
  }, [emitter, action]);
};
