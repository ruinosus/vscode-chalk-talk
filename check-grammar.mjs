// Checks the syntax grammars as VS Code reads them (vscode-textmate with the Oniguruma it uses): a chalk-talk lesson,
// a Mermaid flowchart and sequence with chalk-talk's comments, and the three fenced blocks in Markdown.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vsctm from 'vscode-textmate'
import oniguruma from 'vscode-oniguruma'

const require = createRequire(import.meta.url)
await oniguruma.loadWASM(readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm')).buffer)
const files = {
  'source.chalk-talk': './syntaxes/chalk-talk.tmLanguage.json',
  'source.chalk-mermaid': './syntaxes/chalk-mermaid.tmLanguage.json',
  'markdown.chalk-talk.codeblock': './syntaxes/markdown-chalk-talk.json',
  'markdown.chalk-mermaid.codeblock': './syntaxes/markdown-chalk-mermaid.json',
}
// Markdown itself is VS Code's: a host with no rules stands in for it, so only the injections show
const host = { scopeName: 'text.html.markdown', patterns: [] }
const registry = new vsctm.Registry({
  onigLib: Promise.resolve({ createOnigScanner: (p) => new oniguruma.OnigScanner(p), createOnigString: (s) => new oniguruma.OnigString(s) }),
  loadGrammar: async (scope) => (scope === 'text.html.markdown' ? host : files[scope] ? vsctm.parseRawGrammar(readFileSync(files[scope], 'utf8'), files[scope]) : null),
  getInjections: (scope) => (scope === 'text.html.markdown' ? ['markdown.chalk-talk.codeblock', 'markdown.chalk-mermaid.codeblock'] : undefined),
})

/** Every token of a text: [line, text, scopes]. */
async function tokens(scope, text) {
  const g = await registry.loadGrammar(scope)
  let stack = vsctm.INITIAL
  const out = []
  text.split('\n').forEach((line, n) => {
    const r = g.tokenizeLine(line, stack)
    for (const t of r.tokens) out.push([n, line.slice(t.startIndex, t.endIndex), t.scopes])
    stack = r.ruleStack
  })
  return out
}
let failed = 0
const ok = (cond, what, detail = '') => {
  console.log(`${cond ? '✓' : '✗'} ${what}${!cond && detail ? `\n  ${JSON.stringify(detail)}` : ''}`)
  if (!cond) failed++
}
const scopeOf = (ts, text) => ts.find(([, t]) => t === text)?.[2] ?? []
const has = (ts, text, scope) => scopeOf(ts, text).some((s) => s.startsWith(scope))

const chalk = `title Juntar moedas
param n "moedas por mês" 1..8 = 3

# O gancho
> A Ana guarda moedas todo mês.
person ana at 150,330 "Ana" mood=idea
row at 470,150 gap 14
  repeat n: coin size 44
counter at 470,270 "12*n" "{v:0} moedas"
ana -> banco "deposita"
json {"type": "pause"}
quiz "Se n dobra…"
  * dobra -- cresce em linha reta`
const c = await tokens('source.chalk-talk', chalk)
ok(has(c, 'title', 'keyword.other.header') && has(c, 'param', 'keyword.other.header'), 'chalk-talk: the header lines', c.slice(0, 6))
ok(has(c, 'O gancho', 'markup.heading.chapter') && has(c, 'A Ana guarda moedas todo mês.', 'markup.quote.narration'), 'chalk-talk: the chapter and the narration')
ok(has(c, 'person', 'keyword.control.step') && has(c, 'at', 'keyword.other') && has(c, '150', 'constant.numeric') && has(c, 'mood', 'entity.other.attribute-name') && has(c, 'Ana', 'string.quoted'), 'chalk-talk: a step with its place, point, attribute and label')
ok(has(c, '{v:0}', 'constant.other.placeholder') && has(c, '->', 'keyword.operator') && has(c, 'repeat', 'keyword.control.step'), 'chalk-talk: the placeholder in a text, the arrow, an indented step')
ok(has(c, 'dobra', 'markup.list.option') && has(c, 'cresce em linha reta', 'comment.line.explanation'), 'chalk-talk: a quiz option and its explanation')

const flow = `flowchart LR
  %% title Topologia · Bodega Azul
  %% cast-list 1.10.0
  subgraph s3 ["Cliente"]
    n1(["Cliente"])
  end
  n7 ==>|"SEM histórico · 355"| n6
  n7 -.->|"chama, mas não está na pasta"| n8
  n2 --> n9
  linkStyle 1 stroke:#b7791f,stroke-width:2px
  classDef bad fill:#fde2e1,stroke:#c0392b
  class n6 bad
  t["#quot;x#quot;<br/><small>3</small>"]`
const f = await tokens('source.chalk-mermaid', flow)
ok(has(f, 'flowchart', 'keyword.control.diagram') && has(f, 'LR', 'constant.language.direction'), 'mermaid: the kind and the direction')
ok(has(f, 'Topologia · Bodega Azul', 'markup.heading.title') && has(f, '%% cast-list 1.10.0', 'comment.line'), "mermaid: chalk-talk's title lit; another %% is a comment", f.filter(([n]) => n === 2))
ok(has(f, '==>', 'keyword.operator.arrow') && has(f, '-.->', 'keyword.operator.arrow') && has(f, '-->', 'keyword.operator.arrow'), 'mermaid: the arrows', f.filter(([n]) => n === 6 || n === 7))
ok(has(f, 'subgraph', 'keyword.other') && has(f, 'end', 'keyword.other') && has(f, 'classDef', 'keyword.other') && has(f, 'linkStyle', 'keyword.other'), 'mermaid: the keywords')
ok(f.some(([, t, s]) => t.includes('SEM histórico') && s.some((x) => x.startsWith('string'))) && has(f, '#quot;', 'constant.character.entity'), 'mermaid: a label is text; an entity code is lit', f.filter(([n]) => n === 12))

const seq = `%%{init: {"sequence": {"wrap": true}}}%%
sequenceDiagram
  participant p1 as Cliente
  %% # Frete
  %% > Frete é chamado SEM o histórico.
  p1->>p2: O cliente escreve.
  Note over p2: ⚠ O orquestrador encaminha<br/>«Frete.»
  p2-xp3: ⚠ Chama Fidelidade
  p3-->>p2: a resposta`
const s = await tokens('source.chalk-mermaid', seq)
ok(has(s, '%%{init: {"sequence": {"wrap": true}}}%%', 'meta.preprocessor.directive') && has(s, 'sequenceDiagram', 'keyword.control.diagram'), 'mermaid: the directive and the kind')
ok(has(s, 'Frete', 'markup.heading.chapter') && has(s, 'Frete é chamado SEM o histórico.', 'markup.quote.narration'), "mermaid: chalk-talk's chapter and narration")
ok(has(s, '->>', 'keyword.operator.arrow') && has(s, '-x', 'keyword.operator.arrow') && has(s, '-->>', 'keyword.operator.arrow') && has(s, 'O cliente escreve.', 'string.unquoted.message'), 'mermaid: the messages and their arrows', s.filter(([n]) => n === 5 || n === 7))
ok(has(s, 'participant', 'keyword.other') && has(s, 'Note', 'keyword.other') && has(s, '<br/>', 'entity.name.tag'), 'mermaid: participant, Note, a line break')

const md = ['# Doc', '', '```chalk-talk', '# Um', 'person ana at 1,2', '```', '', '```chalk-mermaid', 'flowchart LR', '  A --> B', '```', '', '```mermaid', 'sequenceDiagram', '  %% # Dois', '```', '', '```js', 'flowchart', '```'].join('\n')
const m = await tokens('text.html.markdown', md)
ok(has(m, 'person', 'keyword.control.step') && scopeOf(m, 'person').includes('meta.embedded.block.chalk-talk'), 'markdown: a ```chalk-talk block is chalk-talk', m.filter(([n]) => n === 4))
ok(has(m, 'flowchart', 'keyword.control.diagram') && has(m, 'Dois', 'markup.heading.chapter'), 'markdown: ```chalk-mermaid and ```mermaid blocks are Mermaid')
ok(!m.filter(([n]) => n === 18).some(([, , sc]) => sc.some((x) => x.includes('mermaid'))), 'markdown: any other block is left alone', m.filter(([n]) => n === 18))

// the real files cast-list writes: every line tokenized, none left as plain text but blanks
const real = readFileSync(new URL('../house-lights/docs/cast-list/examples/bodega-azul.diagrams/topologia.mmd', import.meta.url), 'utf8')
const rt = await tokens('source.chalk-mermaid', real)
ok(rt.some(([, t, sc]) => t === 'flowchart' && sc.some((x) => x.startsWith('keyword.control'))) && rt.filter(([, , sc]) => sc.some((x) => x.startsWith('keyword.operator.arrow'))).length >= 20, "cast-list's topology: the kind and every arrow lit")
process.exit(failed ? 1 : 0)
