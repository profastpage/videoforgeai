export interface VideoJobQueue {
  enqueue(generationId: string): Promise<void>;
}

export class MockVideoJobQueue implements VideoJobQueue {
  async enqueue() {
    return Promise.resolve();
  }
}

export const videoJobQueue = new MockVideoJobQueue();
