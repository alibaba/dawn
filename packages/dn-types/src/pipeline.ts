export interface PipelineItem {
  [property: string]: any;
  name?: string;
}

export interface Pipeline {
  [pipelineName: string]: PipelineItem | PipelineItem[];
}
