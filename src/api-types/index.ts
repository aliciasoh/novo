export type Experiment = {
  id?: string;
  name: string;
  description: string;
  date: string;
};

export type DraftExperiment = Partial<Experiment>;
