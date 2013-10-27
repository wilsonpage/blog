---
layout: post
title: "Math.min and Math.max"
date: 2013-10-22 22:17:00
tags: javascript
---

You've probably heard of and used the `Math.min` and `Math.max` functions in JavaScript before, they're pretty self explanatory.

{% highlight javascript %}
Math.min(5, 10); //=> 5
Math.max(5, 10); //=> 10
{% endhighlight %}

### Something useful

One trick that I found particularly handy, is when using both `Math.min` and `Math.max` together to constrain a number between two bounds.

{% highlight javascript %}
var min = 5;
var max = 10;

Math.max(min, Math.min(15, max)); //=> 10
Math.max(min, Math.min(2, max)); //=> 5
Math.max(min, Math.min(7, max)); //=> 7
{% endhighlight %}

### Something to take-away

We can use 'currying' to create a dynamic constraining function that will constrain numbers to the specified bounds.

{% highlight javascript %}
function constrainer(min, max) {
  return function(n) {
    return Math.max(min, Math.min(n, max));
  };
}

var constrain = constrainer(5, 10);

constrain(15); //=> 10
constrain(2); //=> 5
constrain(7); //=> 7
{% endhighlight %}

<a class="button" href="http://jsbin.com/IGaZuwA/1/edit">Demo</a>
