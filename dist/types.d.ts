export type DefaultConfig = {
    verbose?: boolean;
};
export type RunConfig = {
    job: () => void;
    jobName: string;
    immediate?: boolean;
    immediateCallback?: () => void;
    interval: string;
    delay?: boolean;
    delayDuration?: number;
    /**
     * Example: Asia/Singapore, Pacific/Honolulu
     */
    timezone?: string;
    onError?: (e: Error, jobName: string) => void;
};
export type StopRunConfig = {
    jobName: string;
};
