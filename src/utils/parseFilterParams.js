function parseText(value) {
  if (!value) return undefined;
  return value.trim();
}

function parseBoolean(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export function parseUserFilterParams(query) {
  const { name, tel, role, isActive } = query;

  const parsedName = parseText(name);
  const parsedTel = parseText(tel);
  const parsedRole = parseText(role);
  const parsedIsActive = parseBoolean(isActive);

  return {
    name: parsedName,
    tel: parsedTel,
    role: parsedRole,
    isActive: parsedIsActive,
  };
}

export function parseClientFilterParams(query) {
  const { name } = query;

  const parsedName = parseText(name);

  return {
    name: parsedName,
  };
}

export function parseGlassCategoryFilterParams(query) {
  const { label } = query;

  const parsedLabel = parseText(label);

  return {
    label: parsedLabel,
  };
}

export function parseGlassTypeFilterParams(query) {
  const { label, glassCategory } = query;

  const parsedLabel = parseText(label);
  const parsedGlassCategory = parseText(glassCategory);

  return {
    label: parsedLabel,
    glassCategory: parsedGlassCategory,
  };
}

export function parseOrderFilterParams(query) {}
