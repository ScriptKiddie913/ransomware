export type VictimRecord = {
  company: string;
  group: string;
  date: string;
  country: string;
  industry: string;
  ransomware_type: string;
  leak_url: string;
  description: string;
};

export type GroupRecord = {
  name: string;
  description: string;
};

export type GraphNodeType = "company" | "group" | "industry";

export type GraphNode = {
  id: string;
  type: GraphNodeType;
  val?: number;
};

export type GraphEdge = {
  source: string;
  target: string;
  relationship: "attacked_by" | "belongs_to";
};

export type GraphPayload = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
