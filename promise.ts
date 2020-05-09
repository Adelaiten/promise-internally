const states = {
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected'
}

export class CustomPromise {
    private state: string;
    constructor(executor: (resolve, reject) => unknown) {
        const resolve = () => {
            this.state = states.resolved;
        }

        const reject = (error) => {
            console.log(error);
            this.state = states.rejected;
        }

        this.state = states.pending;
        try {
            executor(resolve, reject);
        } catch(error) {
            reject(error);
        }
    }
}