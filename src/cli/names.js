// @ts-check

/** unsafe = anything beyond [A-Za-z0-9-] (blocks `/`, `.`, `..`) or a control char
 * @param {string} raw
 * @returns {boolean}
 */
function isUnsafeName(raw) {
  return /[^A-Za-z0-9-]/.test(raw);
}

/**
 * @param {string} raw
 * @param {Set<string>} known
 * @returns {{kind:'ok',raw:string,name:string}|{kind:'unknown',raw:string,name:string}|{kind:'unsafe',raw:string}}
 */
export function classifyName(raw, known) {
  if (isUnsafeName(raw)) return { kind: 'unsafe', raw };
  const name = raw.toLowerCase();
  if (known.has(name)) return { kind: 'ok', raw, name };
  return { kind: 'unknown', raw, name };
}

/**
 * @param {string} query
 * @param {string[]} allNames
 * @param {number} [n]
 * @returns {string[]}
 */
export function suggest(query, allNames, n = 5) {
  const q = query.toLowerCase();
  /** @type {[number, string][]} */
  const scored = [];
  for (const name of allNames) {
    let score = -1;
    if (name === q) score = 1000;
    else if (name.startsWith(q)) score = 800 - (name.length - q.length);
    else if (name.includes(q)) score = 500;
    else {
      let i = 0;
      while (i < q.length && i < name.length && q[i] === name[i]) i++;
      if (i >= 3) score = i;
    }
    if (score >= 0) scored.push([score, name]);
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));
  return scored.slice(0, n).map(([, name]) => name);
}
