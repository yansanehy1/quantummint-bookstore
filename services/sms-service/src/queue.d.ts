export interface Job {
    idempotencyKey: string;
    payload: any;
    attempts?: number;
}
export declare function enqueue(job: Job): Promise<void>;
export declare function dequeue(): Promise<Job | null>;
export declare function toDLQ(job: Job): Promise<void>;
