/**
 * Turns Playwright's JSON results into a readable Markdown report.
 * Usage: npm test && npm run report:summary
 */
import * as fs from 'fs';
import * as path from 'path';

interface JsonResult { status: string; duration: number; error?: { message?: string } }
interface JsonTest { projectName: string; status: string; results: JsonResult[] }
interface JsonSpec { title: string; tests: JsonTest[] }
interface JsonSuite { specs?: JsonSpec[]; suites?: JsonSuite[] }

const inputFile = path.resolve('test-results/results.json');
const outputFile = path.resolve('docs/TEST_EXECUTION_REPORT.md');

if (!fs.existsSync(inputFile)) {
  console.error(`No results found at ${inputFile}. Run "npm test" first.`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(inputFile, 'utf-8')) as { suites: JsonSuite[] };

const ansi = /\u001b\[[0-9;]*m/g;
const statusLabel: Record<string, string> = {
  expected: 'PASS',
  unexpected: 'FAIL',
  flaky: 'FLAKY',
  skipped: 'SKIPPED',
};

interface Row { id: string; scenario: string; browser: string; status: string; duration: number; actual: string }
const rows: Row[] = [];

function walk(suite: JsonSuite): void {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      const id = spec.title.match(/^(TC-[A-Z]+-\d+)/)?.[1] ?? '-';
      const scenario = spec.title.replace(/^TC-[A-Z]+-\d+:\s*/, '').replace(/\|/g, '\\|');
      const status = statusLabel[test.status] ?? test.status;
      const duration = test.results.reduce((sum, r) => sum + r.duration, 0);
      const lastError = [...test.results].reverse().find((r) => r.error)?.error?.message;
      const actual =
        status === 'PASS'
          ? 'Behaved as expected'
          : (lastError ?? 'No details').replace(ansi, '').split('\n')[0].replace(/\|/g, '\\|').slice(0, 160);
      rows.push({ id, scenario, browser: test.projectName, status, duration, actual });
    }
  }
  (suite.suites ?? []).forEach(walk);
}
report.suites.forEach(walk);

const count = (s: string) => rows.filter((r) => r.status === s).length;
const lines = [
  '# Test Execution Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `Total: **${rows.length}** | Passed: **${count('PASS')}** | Failed: **${count('FAIL')}** | Flaky: **${count('FLAKY')}** | Skipped: **${count('SKIPPED')}**`,
  '',
  '| Test Case ID | Scenario | Browser | Status | Duration (s) | Actual Result |',
  '|---|---|---|---|---|---|',
  ...rows.map(
    (r) => `| ${r.id} | ${r.scenario} | ${r.browser} | ${r.status} | ${(r.duration / 1000).toFixed(1)} | ${r.actual} |`,
  ),
  '',
];

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, lines.join('\n'));
console.log(`Report written to ${outputFile} (${rows.length} results)`);
