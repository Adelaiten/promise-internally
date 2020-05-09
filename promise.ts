const states = {
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected'
}

export class CustomPromise {
    state;
    value;
    constructor(executor) {
        const members =  { 
            [states.resolved]: {
            state: states.resolved,
            // Chain mechanism
            then: onResolved => CustomPromise.resolve(onResolved(this.value))
            },
            [states.rejected]: {
                state: states.rejected,
                // Ignore mechanism
                then: _ => this
            },
            [states.pending]: {
                state: states.pending
            }
        };
        const changeState = state => Object.assign(this, members[state]);
        const resolve = (value) => {
            this.state = states.resolved;
            changeState(this.state);
            this.value = value;
        }

        const reject = (error) => {
            console.log(error);
            this.state = states.rejected;
            changeState(this.state);

        }

        this.state = states.pending;
        try {
            executor(resolve, reject);
        } catch(error) {
            reject(error);
        }
    }

    static resolve(value) {
        return new CustomPromise(resolve => resolve(value));
    }

    static reject(value) {
        return new CustomPromise((_, reject) => reject(value));
    }
}

const test = new CustomPromise((resolve, reject) => {

});

test.then()