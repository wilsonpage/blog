---
layout: post
title:  "Preventing 'layout thrashing'"
date:   2013-09-19 12:00:00
tags: git
---
Layout Thrashing is when JavaScript violently writes, then reads, from the DOM, multiple times causing document reflows.

{% highlight javascript %}
// Read
var h1 = element1.clientHeight + 'px';

// Write
element2.style.height = h1;

// Document reflow...

// Read
var h2 = element3.clientHeight + 'px';

// Write
element4.style.height = h2;

// Document reflow...
{% endhighlight %}

This may not cause a drastic performance hit on modern desktop browsers; but can have **severe consequences running on low powered mobile devices**.

### Quick fix?

In an ideal world we would simply re-order the execution so that we can batch the DOM read and DOM writes together. This means the document only needs to be reflowed once.

{% highlight javascript %}
// Read
var h1 = element1.clientHeight + 'px';
var h2 = element3.clientHeight + 'px';

// Write
element2.style.height = h1;
element4.style.height = h2;

// Document reflow...
{% endhighlight %}

### What about in the real world?

In reality this isn't so simple. Large applications have code scattered all over the place, all of which has that dangerous DOM at its finger tips. We can't easily (and definitely shouldn't) mash up all our pretty, decoupled code, just so we have control over execution order. What can we do to batch our reads and writes together for optimal performance?

We could write a batching library that DOM touching modules of our app can use to put jobs into a queue? But that then introduces more dependencies into our code base. It would also be tricky knowing when to run the batches.

### Enter requestAnimationFrame

`window.requestAnimationFrame` schedules a function to be executed at the next frame, similar to `setTimeout(fn, 0)`. This is super useful because we can use it to schedule all our DOM writes to run together in the next frame, leaving all DOM reads to run in the current synchronous turn.

{% highlight javascript %}
// Read
var h1 = element1.clientHeight + 'px';

// Write
requestAnimationFrame(function() {
  element2.style.height = h1;
});

// Read
var h2 = element3.clientHeight + 'px';

// Write
requestAnimationFrame(function() {
  element4.style.height = h2;
});
{% endhighlight %}

This means we can keep our nicely encapsulated code where it is, and with a small code tweak, batch our pricey DOM access together! Win!

### Working example

I created a [working example](http://jsbin.com/ebicuJu/2/edit?js,output) to prove the concept. In the first screen shot you can see the aggressive layout thrashing in the Chrome Timeline.

<table>
<tr>
<td><strong>Before</strong></td>
<td><strong>After</strong></td>
</tr>
<tr>
<td>
<img src="http://media.tumblr.com/0e97746d51da4cb6370656a6df687ad3/tumblr_inline_mrsskjBm1a1qz4rgp.png" />
</td>
<td>
<img src="http://media.tumblr.com/4382a661accb0e6ee14702f5abfd168a/tumblr_inline_mrssloEy7I1qz4rgp.png" />
</td>
</tr>
</table>

Following our `requestAnimationFrame` alterations only one layout event took place, and as a result the operation was **~96% faster!**

### Can this scale?

In a simple example using raw `requestAnimationFrame` does allow us to postpone DOM writes to greatly improve performance, but this technique just doesn't scale.

In our app we may need to read from the DOM *after* we have done our write, and then we are in layout thrashing territory again, just in a different frame.

{% highlight javascript %}
// Read
var h1 = element1.clientHeight + 'px';

// Write
requestAnimationFrame(function() {
  element2.style.height = h1;

  // We may want to read the new
  // height after it has been set
  var height = element2.clientHeight;
});
{% endhighlight %}

We could push the read into another `requestAnimationFrame` but then we cannot guarantee another part of the app has not just pushed a write job into the same frame. Essentially it's all going to get a bit chaotic, and once again you no longer have control over when DOM read/writes are happening.

### Introducing 'FastDom'

[FastDom](http://github.com/wilsonpage/fastdom) is a small library I wrote to provide a common interface for batching of DOM read/write work. It massively speeds up DOM work using similar `requestAnimationFrame` techniques described above.

{% highlight javascript %}
fastdom.read(function() {
  var h1 = element1.clientHeight + 'px';
  fastdom.write(function() {
    element2.style.height = h1;
  });
});

fastdom.read(function() {
  var h2 = element3.clientHeight + 'px';
  fastdom.write(function() {
    element4.style.height = h2;
  });
});
{% endhighlight %}

[FastDom](http://github.com/wilsonpage/fastdom) harmonises DOM interactions by taking read and write jobs and batching them (reads then writes) on the next frame. This means you can build app components in isolation without worrying how they will affect (or be affected) by other components in the app.

### Implications of using FastDom

By using [FastDom](http://github.com/wilsonpage/fastdom) you are making **all DOM tasks asynchronous**, that means you can't always make assumptions as to what state the DOM will be in. Work that was previously sync, may not have completed now it is async.

To work around this I like to use an [event system](http://github.com/wilsonpage/event) to be more explicit about when work has finished, and responding only when I know DOM work I'm dependent on is complete.

Also we are **increasing the amount of code** we have to write to effectively get the same amount of work done. Personally I think this is a small price to pay for a dramatic increase in performance.

### Improving FastDom

Web apps are lacking a clear way of solving the problem of layout thrashing. As an app grows it gets harder to coordinate all the different parts to ensure a fast end product. If [FastDom](http://github.com/wilsonpage/fastdom) can help provide a simple interface for developers to solve this problem, it can only mean good things.

*Have a look at the [FastDom project](http://github.com/wilsonpage/fastdom)  and feel free to contribute by submitting pull requests or filing issues.*