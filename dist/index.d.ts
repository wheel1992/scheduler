import { DefaultConfig, RunConfig, StopRunConfig } from './types';
export declare class Scheduler {
    private debug?;
    private runners;
    constructor(config?: DefaultConfig);
    run: (config: RunConfig) => void;
    stop: (config: StopRunConfig) => void;
}
