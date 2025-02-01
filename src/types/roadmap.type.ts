export const RoadmapStatus = Object.freeze({
  planned: 'Planned',
  'in-progress': 'In progress',
  completed: 'completed',
});

export type RoadmapStatusType = keyof typeof RoadmapStatus;

export type Roadmap = {
  _id: string;
  title: {
    en: string;
    fr: string;
  };
  description?: {
    en: string;
    fr: string;
  };
  tags?: {
    en: string[];
    fr: string[];
  };
  status: RoadmapStatusType;
  completedAt?: Date;
};

export type NewRoadmap = {
  title?: {
    en: string;
    fr: string;
  };
  description?: {
    en: string;
    fr: string;
  };
  tags?: {
    en: string[];
    fr: string[];
  };
  status?: RoadmapStatusType;
};
