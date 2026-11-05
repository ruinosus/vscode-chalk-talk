# DNA for VS Code

[DNA](https://github.com/ruinosus/dna)'s visual explainer in the Markdown preview: explainers that draw themselves, chapter
by chapter.

````markdown
```visual-explainer
title Cost per request
param minutes "minutes per request" 2..20 = 8

# The hook
> Every question that reaches HR becomes a request — and every request costs someone's time.
person employee at 120,300 "employee"
desk hr at 420,300 "HR service desk"
employee -> hr "how many days off do I have?"

# Take it apart
> An analyst costs about $60 an hour: each minute of a request costs $1.
counter at 640,300 "minutes" "${v:0} per request"
```
````

In the preview the block becomes the explainer: the chapters, Values and Expand on top; Back, Next, All and the narration
below. It opens on chapter 1, drawn and still. **Expand** shows the whole explainer — values, a question to think about, the
knowledge check, a check of the drawing, and PNG, SVG, GIF and WebM downloads. The drawing uses DNA's business look; the explainer's
**Hand-drawn** button switches to the pencil.

A Mermaid diagram as an explainer — flowchart, sequence, class, state or ER — with `visual-explainer-mermaid` (a plain
`mermaid` block is left alone):

````markdown
```visual-explainer-mermaid
flowchart LR
  %% title A time-off request, from Teams to Workday
  %% # The request
  %% > The employee asks the assistant in Teams.
  A([Employee]) -->|asks| B[Assistant in Teams]
  %% # The record
  %% > The assistant creates the request in Workday, and the manager approves it.
  B -->|creates the request| C[Workday]
```
````

`%% # chapter` and `%% > narration` are Mermaid comments: the same block still renders as a plain diagram elsewhere. A
mistake in the text shows its line where the explainer would be. Everything runs locally.

Blocks written before DNA — ```` ```chalk-talk ```` and ```` ```chalk-mermaid ```` — still work.

## The syntax, lit in the editor

`.chalk` files and ```` ```visual-explainer ```` blocks are lit: the header, the chapters (`# …`), the narration
(`> …`), each step, its place and numbers, the texts and their `{v:0}`. `.mmd` files and
```` ```visual-explainer-mermaid ```` and ```` ```mermaid ```` blocks are lit as Mermaid — the kind, the arrows, the
labels, the entity codes (`#quot;`) — with the explainer's comments (`%% title`, `%% # chapter`, `%% > narration`) standing
out from the other `%%` comments. The diagrams that agent-review writes (`--diagrams`) are lit the same way. If another
Mermaid extension is installed, VS Code uses one of the two for `.mmd`.

The syntax: [text.md](https://github.com/ruinosus/dna/blob/main/skills/visual-explainer/references/text.md). The explainers
come from [@ruinosus/visual-explainer](https://www.npmjs.com/package/@ruinosus/visual-explainer), the same engine as
DNA's Claude skill.

## Install by hand

Not in the Marketplace yet:

```
npm install
npm run package                                  # dna-0.3.0.vsix
code --install-extension dna-0.3.0.vsix
```

Coming from Chalk Talk: uninstall it first (`code --uninstall-extension ruinosus.chalk-talk`), or both light `.chalk`.

MIT.
