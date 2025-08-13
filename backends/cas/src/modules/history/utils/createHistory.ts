import { Change } from '../entities/history.entity';

/**
 *
 * @param currentData Pass the previous data
 * @param updatedData pass the updated data
 * @returns returns the change array to add in history
 */
export const createHistoryData = (currentData, updatedData): Change[] => {
  const changes: Change[] = [];

  for (const key in updatedData) {
    const currentValue = currentData[key] ?? null;
    const updatedValue = updatedData[key] ?? null;
    if (updatedValue !== currentValue) {
      changes.push({
        fieldName: key,
        oldValue: currentValue,
        newValue: updatedValue,
      });
    }
  }
  return changes;
};
