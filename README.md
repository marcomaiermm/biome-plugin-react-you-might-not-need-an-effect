# biome-plugin-react-you-might-not-need-an-effect

A Biome GritQL port of
[`eslint-plugin-react-you-might-not-need-an-effect`](https://github.com/nickjvandyke/eslint-plugin-react-you-might-not-need-an-effect).

## Install

```sh
pnpm add -D @biomejs/biome biome-plugin-react-you-might-not-need-an-effect
```

Extend the package config in `biome.json`:

```json
{
  "extends": ["biome-plugin-react-you-might-not-need-an-effect/biome"]
}
```

Run `pnpm biome lint` or `pnpm biome check`.

Suppress a rule with its filename:

```tsx
// biome-ignore lint/plugin/no-derived-state: The legacy API needs this effect.
setFullName(`${firstName} ${lastName}`);
```

## Compatibility

The rules match direct `useState`/`useEffect` and
`React.useState`/`React.useEffect` calls in function declarations and arrow
functions. They also handle TypeScript state and prop annotations.

## Tests

`pnpm test` runs all 160 valid and invalid cases from the upstream ESLint
plugin against the Biome CLI. The corpus is pinned to its source commit and can
be refreshed with `node scripts/sync-upstream-tests.mjs <upstream-repository>`.
