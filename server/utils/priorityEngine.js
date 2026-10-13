/**
 * Smart Priority Rule-based Engine
 * Note: Transparent rule-based algorithmic priority determination, NOT black-box generative AI.
 */

const HIGH_PRIORITY_CATEGORIES = ['Water', 'Drainage', 'Roads'];

const CRITICAL_KEYWORDS = [
  'hazard',
  'danger',
  'overflow',
  'accident',
  'burst',
  'leakage',
  'blocked drain',
  'exposed wire',
  'cave-in',
  'sinkhole',
  'contamination'
];

/**
 * Calculates priority and explanation based on category, community upvotes, and keywords.
 * @param {Object} params
 * @param {string} params.category
 * @param {number} params.upvotes
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} [params.requestedPriority]
 * @returns {{ priority: 'NORMAL' | 'MEDIUM' | 'HIGH', reason: string }}
 */
function evaluateSmartPriority({
  category = '',
  upvotes = 0,
  title = '',
  description = '',
  requestedPriority = 'NORMAL'
}) {
  const text = `${title} ${description}`.toLowerCase();
  const hasCriticalKeyword = CRITICAL_KEYWORDS.some((kw) => text.includes(kw));
  const isHighCategory = HIGH_PRIORITY_CATEGORIES.includes(category);

  // Community support rule
  // 16+ supports -> High
  // 6–15 supports -> Medium
  // 0-5 supports -> Normal (unless category/keywords elevate it)
  if (upvotes >= 16) {
    return {
      priority: 'HIGH',
      reason: `High community impact threshold reached (${upvotes} citizen endorsements)`
    };
  }

  if (isHighCategory && hasCriticalKeyword) {
    return {
      priority: 'HIGH',
      reason: `Critical civic safety alert: High-impact category (${category}) with safety risk indicators`
    };
  }

  if (upvotes >= 6) {
    return {
      priority: 'MEDIUM',
      reason: `Elevated community concern threshold reached (${upvotes} citizen endorsements)`
    };
  }

  if (isHighCategory) {
    return {
      priority: requestedPriority === 'HIGH' ? 'HIGH' : 'MEDIUM',
      reason: `Essential municipal category (${category}) categorized for expedited review`
    };
  }

  if (hasCriticalKeyword) {
    return {
      priority: 'MEDIUM',
      reason: 'Urgent keywords detected in report description'
    };
  }

  return {
    priority: requestedPriority || 'NORMAL',
    reason: 'Standard baseline civic report criteria'
  };
}

module.exports = {
  evaluateSmartPriority
};
