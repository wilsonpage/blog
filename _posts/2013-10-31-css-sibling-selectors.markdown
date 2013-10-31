---
layout: post
title: "CSS sibling selectors"
date: 2013-10-31 17:25:00
tags: css selectors
---

The are two selectors in CSS which are able to target siblings, `+` and `~`. There are few use cases for these selectors, but in the past I have been very thankful for their existence.

### Adjacent sibling (+)

The adjacent sibling selector will match the next element in the DOM.

{% highlight html %}
<div class="a"></div>
<div class="b"></div>
<div class="c"></div>
<div class="d"></div>
{% endhighlight %}

Let's colour the next div after `.a` green.

{% highlight css %}
.a + div {
  background: green;
}
{% endhighlight %}

<a class="button" href="http://jsbin.com/AXIMUtO/3/edit">Adjacent sibling demo</a>

### General sibling (~)

The general sibling selector is similar, but will style **all** the siblings **after** a particular element.

{% highlight html %}
<div class="a"></div>
<div class="b"></div>
<div class="c"></div>
<div class="d"></div>
{% endhighlight %}

Let's colour all the divs after `.a` green.

{% highlight css %}
.b ~ div {
  background: green;
}
{% endhighlight %}

<a class="button" href="http://jsbin.com/OYEwOwe/1/edit">General sibling demo</a>

### Use case: Markup dependent styling

These selectors particularly useful when working with dynamic markup. If you are working with a data feed, for example news stories, it is unpredictable how much data each story will have. Some stories might have images, some might not. We can use sibling selectors to style stories differently depending on the markup that has been rendered. Consider the following the markup:

{% highlight html %}
<li>
  <h2>Story 1</h2>
  <p>Summary paragraph....</p>
</li>
<li>
  <h2>Story 2</h2>
  <p>Summary paragraph...</p>
</li>
<li>
  <h2>Story 3</h2>
  <img src="http://example.com/image.jpg" />
  <p>Summary paragraph...</p>
</li>
{% endhighlight %}

We can use sibling selectors to hide the summary paragraph when a story has an image.

{% highlight css %}
img ~ p {
  display: none;
}
{% endhighlight %}

We could then choose to show the paragraph using media queries when the screen is big enough. This is a responsive technique I have found useful in some complex layouts I have worked on in the past.

<a class="button" href="http://jsbin.com/EYiGaGi/1/edit">Markup demo</a>

### Use case: Styling by checkbox state

We can use sibling selectors to style things depending on checkbox/radio-button state. This is often how people create some of those crazy interactive experiments without using any JavaScript.

{% highlight css %}
input:checked ~ div {
  background: green;
}
{% endhighlight %}

<a class="button" href="http://jsbin.com/EtECOPI/1/edit">Checkbox demo</a>