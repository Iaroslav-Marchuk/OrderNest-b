import { STATUSES } from '../constants/constants.js';

export const getNextStatus = (current) => {
  const index = STATUSES.indexOf(current);
  if (index === -1 || index === STATUSES.length - 1) return null;
  return STATUSES[index + 1];
};
