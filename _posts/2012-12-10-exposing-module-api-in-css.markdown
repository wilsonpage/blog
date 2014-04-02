---
layout: post
title: "Exposing module API in CSS"
date: 2012-12-10 17:25:00
tags: sass mixins architecture
---

Lately I have been spending a lot of time investigating reusable view modules. A view is made up of several modules (or components), dropped into certain slots within a layout. The aim is that these modules be fully reusable and transportable. In order for this to work a module must not be aware of its context, and it’s styles must not leak out side of its scope. *Currently each module has two files*:

- mymodule.ms (Mustache template)
- mymodule.scss (SASS file)


### The layout

A module sits within a layout module which is an arrangement of slots of certain sizes. The layout is the most responsive part of the app, it’s fluid and expects it’s modules to fill all available space within its slots.

### Layouts as controllers

As time goes on I am seeing this layout module adopting a similar role to a Javascript controller. It is effectively the parent of the modules that sit within it. The layout module is more aware of the overall app, whereas its children are dumb and ignorant (this is good!).

### Modules being too clever

I ran into difficulty sticking to this pattern when view modules needed to respond to changes in their environment. At first I was using media queries directly inside the modules, but that was breaking one of my rules; the module was responding to changes in its environment when it should not know anything of its context! Module styles must remain decoupled from the app itself.

### Layouts telling children what to do

If we have learnt anything from effective application architecture in JavaScript, it is that controllers should call lower level module API, and not the other way round. Effectively we want out CSS layout modules to tell its child modules how to behave, and when. How can we does this, child modules must have some form of API that a higher level (our layout) can call upon.

### Using SASS mixins to expose a module ‘API’

SASS mixins can be used to define alternative states of a module. The layout stylesheet can then include this mixin in certain circumstances (ie. within a particular media query breakpoint).

The example below illustrates this. Module-x has a default `background-color` of red, but it has also exposed an optional state via a mixin called `module-x-blue`. The parent layout has then included this mixin within a media query, therefore forcing the child module-x to change. Effectively calling the `module-x-blue` ‘API’.

{% gist 4252824 %}

### Why is this cool?

We have effectively decoupled our module styling from the app context, but retained the ability for the module to appear differently under different states. A module could have many states that can be called by the developer.

### Doesn’t @include duplicate code every time it is used?

Correct, it does, but let’s weigh up the gains vs. the drawbacks of this:

The power of mixins has enabled us to produce a purely reusable, multi-state, project agnostic component. This reuse alone is going to save you time and code.
Assuming you have defined the majority of style in the default state, the overriding styles within the mixin should be relatively light.
If you don’t use the ‘API’ mixins, they won’t be compiled into your end CSS. This means a module could have a limitless amount of mixins, and the developer can be sure they’ll only be shipping what they use.
Realistically it is unlikely an API mixin is going to be used that many times within a project. In my experience 3 times at an absolute max (in a very large project).

### Summary

SASS empowers us to be more intelligent with our CSS. With a little thought we can apply established patterns that we have learnt from our code, to our stylesheets. Modularisation via small rock solid building blocks is key to producing maintainable applications. The more we can do to share and reuse components, the more productive we can be.

I would live to hear suggestions or experiences from you guys, so feel free to comment :)
