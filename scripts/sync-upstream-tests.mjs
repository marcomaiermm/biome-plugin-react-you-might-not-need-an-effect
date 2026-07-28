import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import vm from "node:vm";

const sourceRoot = resolve(process.argv[2] ?? "");
const output = resolve(
	process.argv[3] ?? "test/upstream/react-you-might-not-need-an-effect.json",
);
const files = [
	"no-adjust-state-on-prop-change.test.js",
	"no-chain-state-updates.test.js",
	"no-derived-state.test.js",
	"no-event-handler.test.js",
	"no-external-store-subscription.test.js",
	"no-initialize-state.test.js",
	"no-pass-data-to-parent.test.js",
	"no-pass-live-state-to-parent.test.js",
	"no-reset-all-state-on-prop-change.test.js",
];
const rules = {};

for (const file of files) {
	let captured;
	const RuleTester = class {
		run(name, _rule, cases) {
			captured = { name, cases };
		}
	};
	const source = readFileSync(
		join(sourceRoot, "src/rules", file),
		"utf8",
	).replace(/^import .*;\n/gm, "");
	const context = vm.createContext({
		RuleTester,
		plugin: { configs: { recommended: {} } },
		rule: {},
	});

	new vm.Script(source, { filename: file }).runInContext(context);

	const normalize = (testCase, index, invalid) => {
		const value = typeof testCase === "string" ? { code: testCase } : testCase;
		return {
			name: value.name ?? `${invalid ? "invalid" : "valid"} ${index + 1}`,
			code: value.code,
			...(invalid
				? {
						diagnostics: Array.isArray(value.errors) ? value.errors.length : 1,
					}
				: {}),
		};
	};

	rules[captured.name] = {
		valid: captured.cases.valid.map((testCase, index) =>
			normalize(testCase, index, false),
		),
		invalid: captured.cases.invalid.map((testCase, index) =>
			normalize(testCase, index, true),
		),
	};
}

const commit = execFileSync("git", ["rev-parse", "HEAD"], {
	cwd: sourceRoot,
	encoding: "utf8",
}).trim();

writeFileSync(
	output,
	`${JSON.stringify(
		{
			source:
				"https://github.com/nickjvandyke/eslint-plugin-react-you-might-not-need-an-effect",
			commit,
			rules,
		},
		null,
		2,
	)}\n`,
);

console.log(
	`Synced ${Object.values(rules).reduce(
		(count, rule) => count + rule.valid.length + rule.invalid.length,
		0,
	)} cases from ${basename(sourceRoot)}@${commit.slice(0, 12)}.`,
);
