<h1 align="center">Snel 🦕</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/crewdevio/Snel/main/static/svelte-logo.svg" width="250">
  <p align="center">A Cybernetical compiler for svelte applications in deno (Snel = fast in Nederlands) </p>
</p>

<p align="center">
   <a href="https://github.com/crewdevio/Snel/issues">
     <img alt="GitHub issues" src="https://img.shields.io/github/issues/crewdevio/Snel">
   </a>
   <a href="https://github.com/crewdevio/Snel/network">
     <img alt="GitHub forks" src="https://img.shields.io/github/forks/crewdevio/Snel">
   </a>
   <a href="https://github.com/crewdevio/Snel/stargazers">
     <img alt="GitHub stars" src="https://img.shields.io/github/stars/crewdevio/Snel">
   </a>
   <a href="https://github.com/crewdevio/Snel/blob/master/LICENSE">
     <img alt="GitHub license" src="https://img.shields.io/github/license/crewdevio/Snel">
   </a>
   <a href="https://deno.land">
     <img src="https://img.shields.io/badge/deno-%5E1.7.0-green?logo=deno"/>
   </a>
</p>

## What is Snel?

It is a `tool/framework` to compile .svelte component to javascript files to create web application using deno and svelte

## Main features

- simple setup
- quick compilation
- hot reloading
- [import maps](https://github.com/WICG/import-maps) support
- support for scss and less out of the box
- support for typescript
- SSR (soon)
- SSG (soon)

## What do I need to start using Snel?

the only thing you need is to run the installation command.

```console
deno run --allow-run --allow-read https://deno.land/x/snel/install.ts
```

> wait wait! Why should I run a script instead of using deno install to install Snel?

Snel uses several tools to create a better development experience, some of these tools are:

- [**trex**](https://github.com/crewdevio/Trex) to handle scripts and compilation in watch mode.
- [**bundler**](https://deno.land/x/bundler) minify and package all files for production

the [install.ts](https://github.com/crewdevio/Snel/blob/main/install.ts) file is responsible for installing all these tools so that you only worry about creating your application.

## how to create a project with Snel?

after running the installation script you just have to run the create command:

```console
snel create [project name]
```

then you just have to enter the created project and start the development server

```console
cd ./[project name]

trex run start
```

this starts your application on a development server in the port you entered in the configuration

## Using svelte core libraries

to use svelte core libraries such as transition, store, motion etc. must be called using the following syntax:

```javascript
import { cubicOut } from "svelte/easing";
import { tweened } from "svelte/motion";
import { onMount } from "svelte";
```

`svelte` tells the compiler that svelte core resources are being accessed.

## Using import maps

You can use import maps to reference the dependencies you use, to use import maps from bes have an `import_map.json` file with the following structure:

```json
{
  "imports": {
    "[package name]": "[package url]"
  }
}
```

In order for the compiler to know that you are using import maps, you need to import the dependencies as follows:

```javascript
import moment from "moment";
import axios from "axios";
```

> **note**: you can use import maps inside svelte components

### Manage import maps dependencies using [trex](https://github.com/crewdevio/Trex)

if you don't have an import map.json file you can create it using the `trex install` command, trex is mainly focused on handling dependencies for `deno` but this doesn't prevent you from being able to use it to handle your dependencies for `snel/svelte`. to install any dependency you just have to use the [custom command](https://github.com/crewdevio/Trex#adding-custom-packages) from trex:

```console
trex --custom axios=https://cdn.skypack.dev/axios
```

this will install axios and it will make it accessible in the import map file:

```json
{
  "imports": {
    "axios": "https://cdn.skypack.dev/axios"
  }
}
```

> **note**: You should know that your dependencies must be compatible with [es modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and with the browser, if you refer to some import maps package and it is not found by the compiler, it will not be transformed, so an error will appear in your browser.

we recommend these sites for you to install your dependencies

- [skypack.dev](https://www.skypack.dev/)
- [esm.sh](https://esm.sh/)
- [jsdelivr.com](https://www.jsdelivr.com/)

## Typescript, Sass and Less support

snel supports typescript out the box, so you can import typescript files into `.svelte` components without specifying the use of typescript within the component.

`App.svelte`

```html
<script>
  import { PI } from "./pi.ts";
</script>

<h1>PI is = {PI}</h1>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

`pi.ts`

```typescript
export const PI: number = Math.PI;
```

Something important to know is that if you are going to import from typescript files without specifying the use of typescript within the component, you can only import non-types elements, example:

- types
- interfaces

in case you want to use the typescript inside the components, you just have to specify it in the `lang` attribute:

```html
<script lang="ts">
  import { PI } from "./pi.ts";

  const message: string = "hello world";

  interface User {
    name: string;
    passworld: string;
  }

  let user: User = { name: "jhon", passworld: "1234" };
</script>
```

to import types and interfaces into components these must be specified using the following syntax:

```html
<script lang="ts">
  import type { .... } from "./types.ts";
</script>
```

and you should only import types using this syntax and not combine imports with other elements.

```html
<script lang="ts">
  // bad
  import type { UserInterface, myFunction } from "./user.ts";

  // good
  import type { UserInterface } from "./user.ts";
  import { myFunction } from "./user.ts";
</script>
```

> **note**: typescript support within components is not stable and compilation errors or hot reloading may appear.

in the same way you can use the syntax of sass and less inside the components to define the styles.

```html
<style lang="scss">
  /* .... */
</style>

<!-- or -->

<style lang="less">
  /* .... */
</style>
```

> **note**: for now importing external styles is not available for css, sass and less.

## Hot Reloading

Snel provides hot reload capability, it compiles and updates the application when changes are applied to it

`example`

![img hot reload](https://raw.githubusercontent.com/crewdevio/Snel/main/static/hotreloading.gif)
