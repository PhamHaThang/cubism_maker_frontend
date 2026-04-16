export const generateCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const generateId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 16; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const PRESET_COLORS = [
  '#8AD3F4', // Light Blue
  '#F0D478', // Yellow
  '#F4A68A', // Coral
  '#8AF4A6', // Green
  '#D48AF4', // Purple
  '#F48AAD', // Pink
  '#78D4F0', // Cyan
  '#A8E6CF', // Mint
  '#FFB7B2', // Salmon
  '#B5EAD7', // Sage
  '#C7CEEA', // Lavender
  '#FFDAC1', // Peach
];

// Alias used in EditorToolbar
export const DEFAULT_COLORS = PRESET_COLORS;

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
] as const;

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':   return '#10B981';
    case 'medium': return '#F59E0B';
    case 'hard':   return '#EF4444';
    case 'expert': return '#7C3AED';
    default:       return '#6B7280';
  }
};
