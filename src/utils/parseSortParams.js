import { SORT_ORDER } from '../constants/constants.js';

function parseSortOrder(sortOrder) {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);

  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
}

function parseSortBy(sortBy, allowedKeys, defaultKey = 'createdAt') {
  if (allowedKeys.includes(sortBy)) {
    return sortBy;
  }
  return defaultKey;
}

export function parseSortParams(query, allowedKeys, defaultKey = 'createdAt') {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy, allowedKeys, defaultKey);
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
