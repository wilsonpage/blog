---
layout: post
title: "Styling different states"
date: 2013-10-29 23:00:00
tags: CSS cleanliness maintenance
---

Creating dynamic, responsive applications means parts of our interface need to have several different appearances, or 'states'. We find ourselves having to do a lot more, with the same amount of markup.

Managing all these states is something that can quickly get out of hand with large applications. I'll go over how I manage elements with several states, and some of the best practices I have developed.

### Building on a default appearance

Every element has to have a default appearance; this is the appearance when no overriding 'state styles' are in affect. I have found it most useful to start with the smallest 'mobile' view first, and then progressively enhancing the element by adding more styles as more states take affect, this is commonly know as the **'mobile first'** approach.

### The 'scattered' approach

The approach I **strongly advise against** is the 'scattered everywhere' approach. By this I mean you may find your default styling for an element in its file (eg. `header.scss`), then throughout the application you find rules in other files that manipulate this default styling. The all too common `mobile.scss` and `ie.scss` spring to mind here.

You have rules that style one particular element, all over your CSS code base. There is no one place a new developer can go to see an overview of the styling for a single element, they have no way of knowing about rules that may be hiding in other files. It also means that your cascade order is at the whim of the order the files are concatenated in. It's all dangerous stuff!

### The centralised approach

I enforce the convention that all **styles for a particular element must be in one central place**. When I'm styling up an element I want to be able to:

- See at a glance all the different 'states' it can be in
- Easily compare the specificity of different rules
- Quickly shift the cascade order or styles

This isn't possible if rules are scattered over many files.

### Coding style

I use SASS nesting, the `&` parent selector to visually contain all the style variations for a particular element. I also use an `@state` comments to clearly indicate where I'm overriding default styling. Let me demonstrate with an example.

{% highlight scss %}
.login-button {
  padding: 10px;
  background: pink;

  /**
   * @hover
   */

  &:hover {
    background: red;
  }

  /**
   * @large
   *
   * The button is bigger
   * on large screens.
   */

  @media (min-width: 700px) {
    padding: 20px;
  }

  /**
   * @logged-in
   *
   * The button is hidden
   * when the 'logged-in'
   * class is on the <body>
   */

  .logged-in & {
    display: none;
  }
}
{% endhighlight %}

What we end up with here is a encapsulated bundle for each element in our application. All the rules inside this bundle only concern a single element.

You can be quicker and more confident in your refactoring, and new team members can comfortably work on a small part of an application, without having to know the whole thing.

> I'm interested to find out how others tackle this problem, drop a comment if you have any useful tips!