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
    name: parsedLabel,
  };
}

export function parseGlassTypeFilterParams(query) {}

export function parseOrderFilterParams(query) {}
