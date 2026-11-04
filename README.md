# Chalk Talk for VS Code

Hand-drawn lessons that draw themselves, chapter by chapter, in the Markdown preview.

````markdown
```chalk-talk
title Saving coins
param n "coins a month" 1..8 = 3

# The hook
> Ana keeps some coins every month.
person ana at 150,330 "Ana" mood=idea

# A year
> Each month, n coins go into the jar.
row at 470,150 gap 14
  repeat n: coin size 44
counter at 470,270 "12*n" "{v:0} coins in a year"
```
````

In the preview the block becomes the lesson: the chapters, Values and Expand on top; Back, Next, All and the narration
below. It opens on chapter 1, drawn and still. **Expand** shows the whole lesson — values, a question to think about, the
quiz, a check of the drawing, and PNG, SVG, GIF and WebM downloads.

A Mermaid diagram, hand-drawn — flowchart, sequence, class, state or ER — with `chalk-mermaid` (a plain `mermaid` block is
left alone):

````markdown
```chalk-mermaid
sequenceDiagram
  %% title A coffee at the counter
  %% # The order
  %% > You ask for a coffee.
  You->>Cashier: a coffee, please
  Cashier-->>You: five dollars
```
````

`%% # chapter` and `%% > narration` are Mermaid comments: the same block still renders as a plain diagram elsewhere. A
mistake in the text shows its line where the lesson would be. Everything runs locally.

## The syntax, lit in the editor

`.chalk` files and ```chalk-talk blocks are lit as chalk-talk: the header, the chapters (`# …`), the narration
(`> …`), each step, its place and numbers, the texts and their `{v:0}`. `.mmd` files and ```chalk-mermaid and
```mermaid blocks are lit as Mermaid — the kind, the arrows, the labels, the entity codes (`#quot;`) — with
chalk-talk's comments (`%% title`, `%% # chapter`, `%% > narration`) standing out from the other `%%` comments. The
diagrams that cast-list writes (`--diagrams`) are lit the same way. If another Mermaid extension is installed, VS Code
uses one of the two for `.mmd`.

The syntax: [text.md](https://github.com/ruinosus/chalk-talk/blob/main/skills/chalk-talk/references/text.md). The lessons
come from [chalk-talk](https://github.com/ruinosus/chalk-talk), the same engine as its Claude skill.

## Install by hand

Not in the Marketplace yet:

```
npm install
npm run package                                  # chalk-talk-0.2.0.vsix
code --install-extension chalk-talk-0.2.0.vsix
```

MIT.
