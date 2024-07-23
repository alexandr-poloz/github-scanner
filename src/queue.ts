export interface Worker<T, D> {
  run(options: T): Promise<D>;
}

type Resolve<T> = (worker: T) => void;

export class Queue<T> {
  private workers: T[] = [];
  private waitingList: Resolve<T>[] = [];

  enqueue(worker: T) {
    const resolve = this.waitingList.shift();

    if (resolve) {
      resolve(worker);
    } else {
      this.workers.push(worker);
    }
  }

  async dequeue() {
    const worker = this.workers.shift();

    if (worker) {
      return worker;
    }

    return new Promise<T>((resolve) => {
      this.waitingList.push(resolve);
    });
  }
}
