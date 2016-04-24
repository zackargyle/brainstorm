Brainstorm
=============

```
> npm install -g brainstorm
```

Brainstorm is a quick start tool for React component prototyping. Basically, I was sick of creating a new directory with all the es6/jsx/webpack setup each time I wanted to prototype a new component, in comes `brainstorm`. The idea is simple, pass it a file name and it will use it as the basis for a new project. Let's say I wanted to create a new tooltip. Here's what you would run:

```
> brainstorm react-fancy-tooltip
```

This will do a few things:

1. Create a new directory called `react-fancy-tooltip` in the current working directory.
2. Create a `ReactFancyTooltip` container component and a `ReactFancyTooltipLayout` component.
3. Hook it up to a webpack devserver.
4. Install dependencies.
5. Open your text editor of choice.
6. Open your browser of choice.

And bam, you're ready to go with your editor open to your new component directory, webpack auto-reload enabled, and your browser open to localhost. In just a few short seconds you're up and ready to start writing some code!

option      | alias  | default         | notes
----------- | ------ | --------------- | ----------
editor      | e      | subl            | the editor to open your new directory in
browser     | b      | "Google Chrome" | the browser to use

```
> brainstorm react-fancy-tooltip --browser firefox --editor atom
> brainstorm react-fancy-tooltip -b firefox -e atom
```

#### TODO
- Add tests
- Add --redux support
- Add scss or cssmodules or something
- Look into postinstall for downloading component dependencies once to avoid `npm install`
- Better `editor` and `browser` support
