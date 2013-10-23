---
layout: post
title: "Return early"
date: 2013-10-23 09:17:00
tags: javascript cleanliness
---

One of my pet hates in JavaScript is code nested inside deep `if`s and `else`s. It seems to make functions a lot harder to follow, and nine times out of ten can be avoided. I'll try to demonstrate by showing a few before and after examples.

### Nested if else

{% highlight javascript %}
function myFunction(value) {

  if (value === 'thing') {
    // do stuff to 'thing'
  } else {
    // if it's not 'thing'

    if (value === 'other thing') {
      // do stuff to 'other thing'
    } else {
      // if it's not 'other thing' do stuff
    }
  }
}
{% endhighlight %}

Could be re-written like

{% highlight javascript %}
function myFunction(value) {

  if (value === 'thing') {
    // do stuff to 'thing'
    return;
  }

  if (value === 'other thing') {
    // do stuff to 'other thing'
    return;
  }

  // if it's not 'other thing' do stuff
}
{% endhighlight %}

### Large if blocks

It is common that we need to address two different code paths in one function. I often see code where the the majority of the function is nested inside an `if` or `else` block. By the time we have got to the `else`, we have forgotten what the condition was in the first place.

{% highlight javascript %}
function myFunction2(value) {

  if (value !== 'thing') {

    // 1. Do this
    // 2. then this

    // 3. then this
    // 4. then this
    // 5. then this

    // 6. then this
    // 7. then this
    // 8. then this

    // 9. then this
    // 10. then this

    if (value === 'foo') {
      // Do stuff when 'foo'
    }

  } else {

    // The vlaue isn't 'thing'
    // and we need to do something
    // slightly different.
  }
}
{% endhighlight %}

By returning early we can address the edge cases and anomalies before we get to the core logic. Every time we return, we are starting from a clean slate. The reader no longer has to hold all that state in their memory...relief!

{% highlight javascript %}
function myFunction2(value) {

  if (value === 'thing') {
    // The vlaue isn't 'thing'
    // and we need to do stuff
    return;
  }

  // 1. Do this
  // 2. then this

  // 3. then this
  // 4. then this
  // 5. then this

  // 6. then this
  // 7. then this
  // 8. then this

  // 9. then this
  // 10. then this

  if (value === 'foo') {
    // Do stuff when 'foo'
  }
}
{% endhighlight %}

### Conclusion

The best type of code we can write is code that others' can quickly understand and contribute to. I'm always looking for ways to make my logic as simple to follow as possible.

Each nested block demands an allocation of memory from the reader. As the reader dives deeper and deeper into nested blocks they will eventually blow their capacity, and lose their train of thought.

If we avoid nesting, we make our code easier to read. If code is easier to read, more people can contribute, and bugs can be more easily spotted.

> I'm looking to add more examples of how returning early can simplify logic, if you have any, please say so and I will add them to this post.