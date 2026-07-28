import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const biome = resolve(
	root,
	"node_modules",
	".bin",
	process.platform === "win32" ? "biome.cmd" : "biome",
);
const upstream = JSON.parse(
	readFileSync(
		resolve(root, "test/upstream/react-you-might-not-need-an-effect.json"),
		"utf8",
	),
);

test("matches the upstream ESLint valid and invalid cases", () => {
	const configDirectory = mkdtempSync(join(tmpdir(), "biome-effect-tests-"));
	const failures = [];
	let cases = 0;

	try {
		for (const [rule, ruleCases] of Object.entries(upstream.rules)) {
			if (process.env.TEST_RULE && process.env.TEST_RULE !== rule) continue;
			const config = join(configDirectory, `${rule}.json`);
			const source = join(configDirectory, `${rule}.tsx`);
			writeFileSync(
				config,
				JSON.stringify({
					linter: { rules: { recommended: false } },
					plugins: [resolve(root, "rules", `${rule}.grit`)],
				}),
			);

			for (const [kind, tests] of Object.entries(ruleCases)) {
				for (const testCase of tests) {
					cases += 1;
					writeFileSync(source, testCase.code);
					const result = spawnSync(
						biome,
						["lint", `--config-path=${config}`, source],
						{ cwd: root, encoding: "utf8" },
					);
					const output = result.stdout + result.stderr;
					const diagnostics = output.match(/\bplugin ━/g)?.length ?? 0;
					const expected = kind === "valid" ? 0 : testCase.diagnostics;

					if (output.includes("Error(s) during loading of plugins")) {
						failures.push(`${rule}: plugin failed to load\n${output}`);
						break;
					}
					if (diagnostics !== expected) {
						failures.push(
							`${rule} › ${testCase.name}: expected ${expected}, received ${diagnostics}`,
						);
					}
				}
			}
		}
	} finally {
		rmSync(configDirectory, { recursive: true });
	}

	assert.equal(
		cases,
		process.env.TEST_RULE
			? Object.values(upstream.rules[process.env.TEST_RULE]).flat().length
			: 160,
	);
	assert.deepEqual(
		failures,
		[],
		`${failures.length} upstream parity failures:\n${failures.join("\n")}`,
	);
});

test("pins the upstream test corpus revision", () => {
	assert.equal(upstream.commit, "dfa7d257150dfa4fce7292a7227d19726f60ae9e");
	assert.equal(
		basename(upstream.source),
		"eslint-plugin-react-you-might-not-need-an-effect",
	);
});

test("consumer can extend the package config", () => {
	const consumer = mkdtempSync(join(tmpdir(), "biome-effect-consumer-"));
	const packageDirectory = join(
		consumer,
		"node_modules",
		"biome-plugin-react-you-might-not-need-an-effect",
	);

	try {
		mkdirSync(join(consumer, "node_modules"));
		symlinkSync(root, packageDirectory, "dir");
		writeFileSync(
			join(consumer, "biome.json"),
			JSON.stringify({
				extends: ["biome-plugin-react-you-might-not-need-an-effect/biome"],
				linter: { rules: { recommended: false } },
			}),
		);
		writeFileSync(
			join(consumer, "example.tsx"),
			`function Form({ first, last }) {
				const [full, setFull] = useState("");
				useEffect(() => setFull(first + last), [first, last]);
			}`,
		);

		const result = spawnSync(
			biome,
			[
				"lint",
				`--config-path=${join(consumer, "biome.json")}`,
				join(consumer, "example.tsx"),
			],
			{ cwd: consumer, encoding: "utf8" },
		);
		const output = result.stdout + result.stderr;

		assert.doesNotMatch(output, /Error\(s\) during loading/);
		assert.match(output, /\bplugin ━/);
	} finally {
		rmSync(consumer, { recursive: true });
	}
});
