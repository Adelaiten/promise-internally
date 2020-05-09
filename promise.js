const states = {
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected'
}
export class CustomPromise {
    state;
    value;
  
    constructor(execute) {
        const tryCall = callback => CustomPromise.try(() => callback(this.value));
        const methods = {
            [states.resolved]: {
                state: states.resolved,
                then: tryCall,
                catch: _ => this
            },
            [states.rejected]: {
                state: states.rejected,
                then: _ => this,
                catch: tryCall
            },
            [states.pending]: {
                state: states.pending
            }
        };
        const changeState = state => Object.assign(this, methods[state]);

        const apply = (state, value) => {
            if(this.state === states.pending) {
                this.value = value;
                changeState(state);
            }
        }

        const getParametersCallback = state => value => {
            if (value instanceof CustomPromise && state === states.resolved) {
                value.then(value => apply(value, states.resolved));
                value.catch(value => apply(value, states.rejected));
            }
            this.value = value;
            changeState(state);
        }

        const resolve = getParametersCallback(states.resolved)
        const reject = getParametersCallback(states.rejected)
        changeState(states.pending);

        try {
            execute(resolve, reject);
        } catch(error) {
            reject(error);
        }
    }
  
    static try(callback) {
        return new CustomPromise(resolve => resolve(callback()));
    }

    static resolve(value) {
      return new CustomPromise(resolve => {
        resolve(value);
      })
    }
  
    static reject(value) {
      return new CustomPromise((resolve, reject) => {
        reject(value);
      })
    }
  }
  