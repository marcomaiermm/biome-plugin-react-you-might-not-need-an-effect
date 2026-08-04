# biome-plugin-react-you-might-not-need-an-effect

[![CI](https://github.com/marcomaiermm/biome-plugin-react-you-might-not-need-an-effect/actions/workflows/ci.yml/badge.svg)](https://github.com/marcomaiermm/biome-plugin-react-you-might-not-need-an-effect/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/biome-plugin-react-you-might-not-need-an-effect)](https://www.npmjs.com/package/biome-plugin-react-you-might-not-need-an-effect)
[![license](https://img.shields.io/npm/l/biome-plugin-react-you-might-not-need-an-effect)](./LICENSE)

A Biome GritQL port of
[`eslint-plugin-react-you-might-not-need-an-effect`](https://github.com/nickjvandyke/eslint-plugin-react-you-might-not-need-an-effect).

## Install

```sh
pnpm add -D @biomejs/biome biome-plugin-react-you-might-not-need-an-effect
```

Extend the package config in `biome.json`:

```json
{
  "extends": ["biome-plugin-react-you-might-not-need-an-effect"]
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

## Release

Change the version in `package.json`, push to `main`, and wait for CI. Then
publish a GitHub release tagged `vX.Y.Z`; the release workflow verifies the tag
and publishes the package to npm.
