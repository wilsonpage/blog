---
layout: post
title: "Animation iteration event"
date: 2013-10-10 09:31
tags: javascript events css
---

Using CSS animations you can spin any element you wish. This is useful if you wish to roll your own loading indicator for example.

{% highlight css %}
div.spin {
  animation: spin 1000ms linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}
{% endhighlight %}

One thing that has always bothered me about this is that once the loading has finished and we remove the `spin` class, the animation would abruptly jump back to its starting position (`0deg`).

### A helpful event

The `animationiteration` iteraction event will fire every time a currently animating element completes an iteration.

{% highlight javascript %}
div.addEventListener('animationiteration', function() {
  console.log('tick');
});
{% endhighlight %}

### Solving the problem

We can use this event to remove our `spin` class at exactly the right time so that our animation doesn't jump back to the start when loading has finished.

{% highlight javascript %}
function start() {
  div.classList.add('spin');
}

function stop() {
  div.addEventListener('animationiteration', callback);

  function callback() {
    div.classList.remove('spin');
    div.removeEventListener('animationiteration', callback);
  }
}
{% endhighlight %}

### Browser support

The `animationiteration` event is well supported in modern browsers using the following prefixes.

| | |
|--------------|----------------------|
| **W3C Standard** | `animationiteration` |
| **Firefox** | `animationiteration` |
| **Webkit** | `webkitAnimationIteration` |
| **IE10** | `MSAnimationIteration` |

### Demo

[Here is a demo](http://jsbin.com/AwoYuxE/2) I made to demonstrate a use case.