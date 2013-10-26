---
layout: post
title: "Batching image insertion"
date: 2013-10-23 19:09:00
tags: performance javascript
---

One of the most expensive things we do inside our app is insert base64 encoded images into the DOM. You can easily blow your frame budget (16ms) if you try to insert too many images in one go. Below is a timeline showing one particular frame being smashed when a load of images get inserted into the DOM.

[![](/lib/images/batching-image-insertion-1.png)](/lib/images/batching-image-insertion-1.png)

In this simplified version of the code, we have a list of image objects. We loop over these objects, create an image node for each, set the `src` to the base64 data URI string, and then insert it into the DOM.

{% highlight javascript %}
images.forEach(inject);

function inject(image) {
  var el = document.createElement('img');
  el.src = image.src;
  document.body.appendChild(el);
}
{% endhighlight %}

### Spreading the load

**The technique above doesn't scale**. The more images we have to insert, the worse our rendering performance gets. If we could find a way to take work off this single frame and spread it over more frames, we may be able to reach a better frame rate. [FastDom](http://github.com/wilsonpage/fastdom) can help us with this.

### fastdom.defer()

FastDom's `.defer` method allows us to defer work until the next **available** animation frame.

{% highlight javascript %}
fastdom.defer(function() {
  // This will run in frame 1
});

fastdom.defer(function() {
  // This will run in frame 2
});

fastdom.defer(function() {
  // This will run in frame 3
});
{% endhighlight %}

This is super useful when you want to spread load over several frames. So to improve the performance of our image insertion we will first break the list into batches, and then insert them inside a `fastdom.defer` job.

{% highlight javascript %}
var batchSize = 6;
var batch;

// Break down list into batches
for (var i = 0, l = placeholders.length; i < l; i += batchSize) {
  batch = images.slice(i, i + batchSize);
  injectBatch(batch);
}

// Schedules a batch
// for the *next* frame
function injectBatch(batch) {
  fastdom.defer(function() {
    batch.forEach(inject);
  });
}

// Injects an image
function inject(image) {
  var el = document.createElement('img');
  el.src = image.src;
  document.body.appendChild(el);
}
{% endhighlight %}

Now our timeline looks a little different. You can see that the expensive image work is spread over about five frames instead of one, and we are not longer blowing the 60fps threshold.

[![](/lib/images/batching-image-insertion-2.png)](/lib/images/batching-image-insertion-2.png)

### Batch size

In my example I used a batch size of 6. This isn't a magic number, I simply used the timeline to determine an appropriate number for my case. You should profile your own image insertion and find a batch size you're happy with.

### Conclusion

This is just one of the useful applications for the [FastDom](http://github.com/wilsonpage/fastdom)'s `.defer` API. Timeline your app and check for where you are blowing your frame budget.

If you're ['layout thrashing'](/preventing-layout-thrashing) you should look into `fastdom.read` and `fastdom.write`, if you're simply doing too much in one frame think about **spreading your work over several frames**.
