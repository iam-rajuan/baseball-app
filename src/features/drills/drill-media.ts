export function getCategoryIdFromName(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export function getCategoryEyebrow(categoryName: string) {
  return `${categoryName} Drills`;
}
