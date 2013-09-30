---
layout: post
title: "Object.create()"
date: 2013-09-30 22:05
tags: javascript
---
`Object.create()` returns a new object with a `prototype` of the object you passed it.

{% highlight javascript %}
var proto = { foo: 'bar' };
var newObject = Object.create(proto);

newObject.foo; //=> 'bar'
newObject.hasOwnProperty('foo'); //=> false
{% endhighlight %}

### Inheritance

{% highlight javascript %}
var o1 = { one: '1' };

var o2 = Object.create(o1);
o2.two = '2';

var o3 = Object.create(o2);
o3.three = '3';

var o4 = Object.create(o3);
{% endhighlight %}

Results in a prototype chain like:

![](/lib/images/object-create_image-1.png)

Which means we can do:

{% highlight javascript %}
o4.one; //=> 1
o4.two; //=> 2
o4.three; //=> 3
{% endhighlight %}

### What about the second argument?

The second argument is not too exciting; it works as a convenient shortcut to `Object.defineProperties()`. In short `Object.defineProperties` allows you to define the properties of particular keys on your object.

I won’t go over the API for `Object.defineProperties` in this article, but you can read all about it on our ever trustworthy [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties).

**[Working demo](http://jsbin.com/AduCiZA/1/edit?js,console)**