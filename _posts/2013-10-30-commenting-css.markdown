---
layout: post
title: "Commenting CSS"
date: 2013-10-30 00:17:00
tags: CSS cleanliness maintenance
---

Commenting CSS is critical if you are to inform fellow team members (or even just your future self) why you have written code as you have. Code is re-written all the time, and if clever solutions/hacks are not documented, they can easily be left out; this all to often how style regressions get introduced. Clean, consistent formatting also suggests a level of code quality that contributors will feel inclined to match.

### Header

I use a brief header comment to title the file and add a sentence or two about what the file does. This is not only useful for newcomers, but can help identifying source files when looking at built CSS in dev tools.

{% highlight scss %}
/**
 * Footer
 *
 * The main application footer
 * found on all pages.
 */

.footer {}
{% endhighlight %}

### Notes

If it is not 100% clear why a particular rule is in place, comment it. I have borrowed a 'footnote' technique I saw [Nicolas Gallagher](https://twitter.com/necolas) using in [normalize.css](https://github.com/necolas/normalize.css/). It's awesome because your comments can be as long as you want without them getting in the way of your code.

{% highlight scss %}
/**
 * 1. Required for correct positioning
 *    of absolutely positioned descendants.
 * 2. Clears floats
 */

.footer {
  position: relative; /* 1 */
  overflow: hidden; /* 2 */
}
{% endhighlight %}

### Dividers

Files will consist of different parts. I use a standard divider comment to clearly split these parts out, this makes finding things quicker.

{% highlight scss %}
.footer {}

/** Links
 ---------------------------------------------------------*/

.footer_links {}

/** Copyright
 ---------------------------------------------------------*/

.footer_copyright {}
{% endhighlight %}

Make sure that what ever you choose to be your divider is a 'snippet' in all dev's code editors. To insert a divider in my editor (Sublime Text) all I have to do is type `'div'` + `tab`, and it prints it for me. [Find out how to setup snippets in Sublime Text 2](http://docs.sublimetext.info/en/sublime-text-3/extensibility/snippets.html).

### State overrides

I like to clearly indicate when I'm overriding default styling by using an `@state` comment block. When I see an `@state` comment, I know the styling that follows it will only take affect if certain criteria are met. A 'state' could be screen size, orientation, body classes, pseudo classes, state classes, attributes...almost anything!

{% highlight scss %}
.button {
  background: blue;

  /**
   * @hover
   */

  &:hover {
    background: red;
  }

  /**
   * @active
   */

  &:active {
    background: green;
  }

  /**
   * @large screen
   */

  @media (min-width: 700px) {
    font-size: 2em;
  }

  /**
   * @hide-all-buttons
   */

  .hide-all-buttons & {
    display: none;
  }
}
{% endhighlight %}

### Single line breaks

For consistency I chose to one empty line break between all blocks. I first saw [TJ Holoway Chuck](https://github.com/visionmedia) using this style in JavaScript and thought it looked beautifully clean. I love the consistent 'rhythm' it seems to bring when reading. I have been replicating it in my JS and CSS code ever since.

{% highlight scss %}

/**
 * Module
 *
 * A description of Module.
 */

.module {}

/** Foo
 ---------------------------------------------------------*/

/**
 * 1. This needs a comment
 */

.module_foo {
  position: relative; /* 1 */
}

/** Bar
 ---------------------------------------------------------*/

.module_bar {
  position: relative;

  /**
   * @hover
   *
   * Say why the background
   * turns red when hovered
   * if need be.
   */

  &:hover {
    background: red;
  }
}
{% endhighlight %}

### Comment line length

I try to keep the line length of comments under 40 characters. For me it seems to make comments a little more digestible.

{% highlight scss %}
/**
 * Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore
 * magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis
 * nisl ut aliquip ex ea commodo consequat.
 */

.hard-to-read {}

/**
 * Lorem ipsum dolor sit amet,
 * consectetuer adipiscing elit,
 * sed diam nonummy nibh euismod
 * tincidunt ut laoreet dolore
 * magna aliquam erat volutpat.
 *
 * Ut wisi enim ad minim veniam,
 * quis nostrud exerci tation
 * ullamcorper suscipit lobortis
 * nisl ut aliquip ex ea commodo
 * consequat.
 */

.easy-to-read {}
{% endhighlight %}

### Conclusion

Commenting is a small thing, but can have big impact, especially when working on large teams. It doesn't only inform and guide fellow developers, preventing silly regressions; it underpins a code quality standard.

If code is messy and undocumented, it grants permission for other team members to do the same. Quickly your new shiny code base begins to turn into that all too familiar tangled hacky mess. In society this is known as the ['broken windows theory'](http://en.wikipedia.org/wiki/Broken_windows_theory), I would argue this theory applies to code too.