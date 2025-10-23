import React from 'react'
/*
  Temporary stub: keep this file while you remove all imports/usages across the repo.
  Run:
    grep -R --line-number "Navigation" src
  For each reported file:
    - remove the import line, e.g. `import Navigation from '.../Navigation'`
    - remove the JSX usage `<Navigation />` (or replace with your alternative)
  After all references are removed:
    git rm "src/components/common/Navigation.jsx"
    git commit -m "chore: remove Navigation component"
*/
export default function Navigation() {
  // warn so you can spot remaining usages at runtime
  if (typeof console !== 'undefined') {
    console.warn('[Navigation] component has been removed. Remove imports/usages and delete this file.')
  }
  return null
}