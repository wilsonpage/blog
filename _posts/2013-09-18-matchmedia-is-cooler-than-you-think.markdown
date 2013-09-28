---
layout: post
title:  "matchMedia is cooler than you think"
date:   2013-09-18 18:16:00
tags: matchmedia javascript
---
Most of you will have heard about `window.matchMedia`. It's a relatively simple API that accepts a string in the form of CSS `@media` query.

{% highlight javascript %}
var result = window.matchMedia('(min-width:400px)');
{% endhighlight %}

We can see if the media query passed currently matches by inspecting the `result.matches` property. Pretty dull hey...? But things get a little more interesting when we realise that the object returned is actually **live**.

The `result.matches` boolean will update whenever the media query condition matches or un-matches. Best of all we have a way of listening for when this change has occurred. Let's have a closer look at the object returned from `window.matchMedia`.

### The mediaList object

- `matches {Boolean}` Declares whether the media query currently matches.
- `media {String}` The media query string that was originally passed.
- `addListener {Function}` A method to attach a callback to fire when the `matches` state changes.
- `removeListener {Function}` A method to remove a previously registered callback.

### Listening for changes

We now have means by which we can run code when the window enters or leaves declared breakpoints. This is super useful when we are building parts of our app that not only new to look different at different screen sizes, but also need to behave differently.

{% highlight javascript %}
var media = window.matchMedia('(min-width: 500px)');

media.addListener(function(data) {
  alert('matches: ' + data.matches);
});
{% endhighlight %}

### Demo

I whipped up a quick demo that shows how you can setup and teardown component states by responding to matchMedia callbacks.

<a class="demo-button" href="http://jsbin.com/ipiqADi/1/edit?js,output">View demo</a>