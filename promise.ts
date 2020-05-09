const states = {
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected'
}
export class CustomPromise {
    state;
    value;
  
    constructor(execute) {
        const methods = {
            [states.resolved]: {
                state: states.resolved,
                then: thenMethod => CustomPromise.resolve(thenMethod(this.value))
            },
            [states.rejected]: {
                state: states.rejected,
                then: _ => this
            },
            [states.pending]: {
                state: states.pending
            }
        };

      const resolve = (value) => {
        this.state = states.resolved;
        Object.assign(this, methods[this.state]);
        this.value = value;
      }
  
      const reject = (error) => {
        this.state = states.rejected;
        Object.assign(this, methods[this.state]);
        console.error(error);
      }
      
      this.state = states.pending;
      Object.assign(this, methods[this.state]);
      try {
        execute(resolve, reject);
      } catch(error) {
        reject(error);
      }
    }
  
    static resolve(value) {
      return new CustomPromise((resolve, reject) => {
        resolve(value);
      })
    }
  
    static reject(value) {
      return new CustomPromise((resolve, reject) => {
        reject(value);
      })
    }
  }
  