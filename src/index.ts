import { useEffect } from 'react';
import EventEmitter, {
  type EmitterSubscription,
} from 'react-native/Libraries/vendor/emitter/EventEmitter';

/**
 * A class that emits values.
 * @param T The type of the value.
 */
export class ValueEmitter<T> extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * Emit a value.
   * @param v The value to emit.
   */
  add(v: T) {
    this.emit('value', v);
  }

  /**
   * Listen for value events.
   * @param handler The handler to call when a value is emitted.
   * @returns A subscription object that can be used to remove the listener.
   */
  onValue: (handler: (v: T) => void) => EmitterSubscription = (handler) => {
    return this.addListener('value', handler);
  };

  /**
   * Map the emitter to a new emitter.
   * @param mapping The mapping function to apply to the emitted values.
   * @returns A new ValueEmitter that emits the mapped value.
   */
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

/**
 * A class that emits values and maintains a state.
 * @param T The type of the value.
 */
export class StateValueEmitter<T> extends ValueEmitter<T> {
  constructor(initialValue: T) {
    super();
    this.value = initialValue;
  }

  /**
   * Emit a value.
   * @param v The value to emit.
   */
  add(v: T) {
    this.value = v;
    super.add(v);
  }

  /**
   * Get the current value.
   * @returns The current value.
   */
  value: T;

  /**
   * Map the emitter to a new emitter.
   * @param mapping The mapping function to apply to the emitted values.
   * @returns A new ValueEmitter that emits the mapped value.
   */
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

/**
 * A hook that subscribes to a ValueEmitter and calls the action when a value is emitted.
 * The emitter is automatically unsubscribed when the component is unmounted.
 * @param action The action to call when a value is emitted.
 * @param emitter The ValueEmitter to subscribe to.
 */
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
