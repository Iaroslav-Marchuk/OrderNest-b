// import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const ACCESS_TOKEN_EXP = 15 * 60 * 1000;
export const REFRESH_TOKEN_EXP = 24 * 60 * 60 * 1000;

export const STATUSES = ['created', 'in_progress', 'completed'];

export const LOCATIONS = [
  'line_1',
  'line_2',
  'line_3',
  'hardening',
  'quality',
  'logistics',
];

export const ROLES = [
  'admin',
  'cutting',
  'hardening',
  'assembly',
  'quality',
  'logistics',
  'guest',
];

export const MIN_DAYS_BEFORE_MANUAL_DELETE = 45;

// export const SMTP = {
//   SMTP_HOST: 'SMTP_HOST',
//   SMTP_PORT: 'SMTP_PORT',
//   SMTP_USER: 'SMTP_USER',
//   SMTP_PASSWORD: 'SMTP_PASSWORD',
//   SMTP_FROM: 'SMTP_FROM',
// };

// export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
