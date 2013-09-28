---
layout: post
title:  "JavaScript inheritance"
date:   2013-09-22 07:57:19
tags: javascript patterns inheritance
---

Inheritance is the process of generating a new class that is based on (or extends from) the properties of an existing class. JavaScript doesn’t offer inheritance out of the box, but with just four lines of code we can make our own inheritance method. I will will introduce this technique, and attempt to explain simply how it works.

{% highlight javascript %}
function inherit(A, B) {
  function F(){} // 1.
  F.prototype = A.prototype; // 2.
  B.prototype = new F(); // 3.
  B.prototype.constructor = B; // 4.
}
{% endhighlight %}

### What’s going on here?

Above we have defined a method that accepts two constructor functions. `A` represents the base class which we a extending from, and `B` represents the class which will extend from `A`. The routine goes as follows:

1. Create a new temporary function.
2. Overwrite the temporary function’s prototype object with A’s prototype object.
3. Overwrite B’s prototype object with an instance of the temporary class `F`. This means `B`’s protype is now an empty object with it’s own prototype…`A.prototype`, we have extended the ‘prototype chain’.
4. `B`’s direct prototype now no longer has a `constructor` property, so, incase anyone wants to use this property, we must re-set it.

### Usage

{% highlight javascript %}
// Create a base class
// with a generic method
function Animal(){};
Animal.prototype.eat = function(){ return 'eating'; };

// Define another class
function Bird() {}

// Manipulate the `Bird`
// class’s prototype to
// extend from `Animal`
inherit(Animal, Bird);

// Add a Bird specific
// property to the prototype
Bird.prototype.fly = function(){ return 'flying'; };

// Create a bird
var bird = new Bird();

// Test that bird has both
// the `Animal` properties
// and the `Bird` properties
bird.eat(); //=> eating'
bird.fly(); //=> 'flying'

// Test that bird is both an
// instance of `Animal` and `Bird`
bird instanceof Animal; //=> true
bird instanceof Bird; //=> true
{% endhighlight %}

### The prototype chain

Under the hood all we’re doing is extending the `Animal.prototype`, adding a new object to the top of the chain and defining additional properties on that object. In this case the chain looks as follows:

`Bird` <= `Animal` <= `Object`

![Prototype chain](http://media.tumblr.com/2e48e6e89619dcb3e534e0b2530de90d/tumblr_inline_mthq8qaRLN1r24j9x.png)

When a property is accessed on the instance, the JS runtime will check each layer of the prototype (shallowest to deepest) until the property is found. If the property is not found on the last layer of the prototype, `undefined` is returned.

**NOTE:** There are [performance issues](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain#Performance) that come from extending the prototype chain too far. I’ve found there is rarely reason to be extending more than one layer deep. Keep the inheritance chain as **short as possible**.

### Object.create()

This is just one of the many techniques out there when implementing an inheritance style pattern in JavaScript. Since ES5 [`Object.create`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) has been available and can simplify the process even further.

{% highlight javascript %}
function inherit(A, B) {
  B.prototype = Object.create(A.prototype);
  B.prototype.constructor = B;
}
{% endhighlight %}

### Conclusion

In my experience I’ve found very few cases that genuinely require inheritance. It can sometimes seem like a good idea at the time, but in the long run can end up over complicating things. My advice for most cases would be: **try to use [composition over inheritance](http://stackoverflow.com/questions/8696695/composition-inheritance-and-aggregation-in-javascript#answer-8696786), keep relationships simple.**