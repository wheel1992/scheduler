export type RunConfig = {
  job: () => void;
  jobName: string;
  immediate?: boolean;
  immediateCallback?: () => void;
  interval: string;
  delay?: boolean;
  delayDuration?: number;
  debug?: boolean;
};

export type StopRunConfig = {
  jobName: string;
}
