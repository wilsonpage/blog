---
layout: post
title: "Sensible CSS"
date: 2013-10-29 16:00:00
tags: CSS cleanliness maintenance
---

Every developer can write CSS, the hard part is keeping things manageable as your app starts to grow.

Over the past two years I've been writing CSS for several large web applications. I've been fortunate enough to be the primary maintainer of these code bases, which has given me free reign to try out various approaches in an attempt to keep things sensible. In this post I will will share some of my techniques which I feel really made a difference.

### 1. Preprocessors

If there's one single thing that really made my life easier it's preprocessors. We chose to use SASS on the projects I worked on. I had used LESS in the past, but chose to start using SASS mainly because it's all I ever heard other CSS devs talk about, and also due to [this post](http://css-tricks.com/sass-vs-less/) by Chris Coyier.

Aside from which preprocessor you choose to use, I will become your closest ally in helping you to fight the battle for sensible CSS. The tips that follow will assume that you are using a preprocessor. Examples will be in SASS, but most should be easily transferable to other languages.

### 2. Standard padding

Throughout our app we need to use padding and margins to space things out. In apps I've worked on in the pass these values have all to often just been random pixel values that looked close to the mockup at the time.

Keep all spacing in your app looking consistent by introducing padding variables. I like to keep these 'app wide' variables in a single file called `vars.scss`.

{% highlight scss %}
$padding: 14px;
$padding-200: $padding * 2;
$padding-150: $padding * 1.5;
$padding-75: $padding * 0.75;
$padding-50: $padding * 0.5;
{% endhighlight %}

Throughout your app make it a rule that every padding or margin definition must use the standard variables.

{% highlight scss %}
.header {
  padding: $padding;
  margin-bottom: $padding-200;
}
{% endhighlight %}

### 3. Standard colours

Every professional application has a colour pallet. Don't bother typing those horrible hex codes all over your app. Instead define them in once inside your `vars.scss` file and use the variables throughout your app code.

{% highlight scss %}
$color-blue: #4781AA;
$color-blue-dark: #002F5F;
$color-dark-text: #333;
$color-medium-text: #505050;
$color-light-text: #777;
$color-pink: #FFF1E0;
$color-claret: #9E2F50;
$color-pink-tint-1: #F6E9D8;
$color-pink-tint-2: #E9DECF;
$color-warm-grey-1: #A7A59B;
$color-warm-grey-2: #74736C;
{% endhighlight %}

It's now a breeze if your designer wants to alter the color pallet slightly.



### Modules (OOCSS)

### Naming

### Nesting

With CSS preprocessors comes the ability to nest selectors. With all new things, it's easy to get carried away. I like to keep it to a minimum, attempting not to nest deeper than three levels. I name my classes in a way that means that I can write really short, specific selectors.

This is good for selector matching performance (negligible) and means elements remain portable. By 'portable' I mean that if markup changes slightly, you don't have to go through altering selectors that were previously very specific, so that they match the new document structure.


### File structure

The first step to sensible CSS is keeping files as short as possible. I want each file to cover a very specific part of my application, there should be no rules inside that file that do not concern that part.

Let's have a look at a fictitious `header.scss` file as an example.

{% highlight scss %}
.header {
  background: red;
}
{% endhighlight %}

I know what you're thinking: 'this is ludicrous, an entire file for one CSS rule!'. Relax...this this is fine! We're using a preprocessor that will combine all these files into one file, so there really is no overhead to creating more files. I've worked on projects with 100 - 150 `.scss` files, and it was one of the most effective ways of keeping things manageable.

What we're getting here is 'separation of concern', and this is super valuable! Although right now our `header.scss` file is really short, who knows how it will evolve over the course of the applications life. Whenever I start styling a new part of an application, the first thing I do is create a new file for it. **The more files you have, the better!**

### Selector order

Not all the files in you application are going to be as short as `header.scss` above. When files do begin to grow, it is important to structure them consistently so devs know where to find rules. To help with this, I stick by the simple convention of **ordering my selectors in the same order that they appear in the markup**.

If the markup looks like this,

{% highlight html %}
<header class="header">
  <ul class="header_links">...</ul>
  <input class="header_search" type="search" />
</header>
{% endhighlight %}

... the corresponding stylesheet should look like this,

{% highlight scss %}
.header {}
.header_links {}
.header_search {}
{% endhighlight %}

### Property order

### Mixins

### JS only classes

One of the tricky things about classes is that they may not only be being used for styling, they could be being used in JavaScript too. This can make refactoring markup a daunting process, you want to tidy everything up, but changing a class name that JavaScript is dependent on could take down your whole app.

A convention of 'Javascript specific classes' that [Nicolas Gallagher wrote about](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/) has proven to work really well. In our markup we have two types of classes, styling classes and JavaScript classes. It is clear when a class is a JavaScript class as it is prefixed with `js-`.

{% highlight html %}
<input class="header_search js-search" type="search" />
{% endhighlight %}

When were want to select the element in JavaScript we use the `js-search` class.

{% highlight javascript %}
var el = document.querySelector('.js-search');
{% endhighlight %}

In CSS we use the un-prefixed class. **Styling using the `js-*` classes is strictly forbidden**.

{% highlight scss %}
.header_search {
  /* styles */
}
{% endhighlight %}

### Reset

### Avoid 'globals'

In JavaScript it is common knowledge that polluting the global scope with variables is bad practice, in CSS it is less well known. I've inherited projects where I have spent months battling against global styles, let me give an example,

{% highlight scss %}
button {
  margin-bottom: 20px;
}
{% endhighlight %}

By writing the above CSS the developer has made the assumption that every `<button>` element in the application must have the following styles. Now everytime I want to use a button element I find myself reseting these styles,

{% highlight scss %}
.my-button {
  margin-bottom: 0;
}
{% endhighlight %}

If we have third-party widgets in our app, they too will be impacted by these global styles.
