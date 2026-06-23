// Static display metadata for backend template codes ("01", "02", "03").
// The backend only returns codes + availability; this maps codes to
// names, layout kind, and the color palette options offered for that
// template. The Resume document only stores a single `template` string,
// so the selected color is encoded into it as `${code}-${colorId}`
// (e.g. "01-violet"). Parse with parseTemplateValue() below.

export const COLOR_PALETTES = [
  { id: 'violet', label: 'Violet', accent: '#7c3aed', soft: '#f1e8fd' },
  { id: 'ocean', label: 'Ocean', accent: '#0ea5e9', soft: '#e6f7fd' },
  { id: 'forest', label: 'Forest', accent: '#10b981', soft: '#e7f9f1' },
  { id: 'sunset', label: 'Sunset', accent: '#f97316', soft: '#fef0e4' },
  { id: 'slate', label: 'Slate', accent: '#475569', soft: '#eef1f4' },
  { id: 'rose', label: 'Rose', accent: '#e11d48', soft: '#fde8ee' },
];

export const TEMPLATE_META = {
  '01': {
    name: 'Classic Professional',
    layout: 'single-column',
    description: 'A timeless single-column layout with clear section dividers.',
  },
  '02': {
    name: 'Modern Sidebar',
    layout: 'sidebar',
    description: 'A colored sidebar for contact info, paired with a focus column for experience.',
  },
  '03': {
    name: 'Minimal Compact',
    layout: 'compact',
    description: 'A dense, minimal layout ideal for candidates with extensive experience.',
  },
};

export const getTemplateMeta = (code) =>
  TEMPLATE_META[code] || { name: `Template ${code}`, layout: 'single-column', description: '' };

export const getPalette = (id) =>
  COLOR_PALETTES.find((p) => p.id === id) || COLOR_PALETTES[0];

// "01-violet" -> { code: "01", colorId: "violet" }
export const parseTemplateValue = (value) => {
  if (!value) return { code: '01', colorId: 'violet' };
  const [code, colorId] = value.split('-');
  return { code: code || '01', colorId: colorId || 'violet' };
};

export const buildTemplateValue = (code, colorId) => `${code}-${colorId}`;
