export type change = {
  fieldName: string;
  oldValue: string;
  newValue: string;
};
export interface History {
  entityId: string;
  entityType: string;
  changeType: string;
  changedBy: string;
  changedByName: string;
  changedAt: string;
  changes: change[];
}

export interface HistoryUser {
  deletedAt?: string | null;
  histories?: History[];
}
