---
layout: post
title: "The component approach"
date: 2014-01-18 17:10:00
tags: javascript components
---

One of the most important things I've learnt in my time as a front-end developer is the value of 'components'. We hear the term being tossed around all to often in the community, but to many of us components are still a foreign concept.

In this article I will aim to clarify:

- What we really mean by 'components'.
- How we can make our own components.
- What the advantages to this approach are.

### What is a component?

> "a part that combines with other parts to form something bigger"
> <br/> - [Cambridge Dictionary](http://dictionary.cambridge.org/dictionary/british/component?q=component)

When I talk about a component in the context of development, I'm referring to a distinguishable part of user interface that when combined with other parts, forms a final application. A UI component comprises of markup (HTML), styling (CSS) and, when needed, interactions (JS).

### Encapsulation

A component is usual **self contained**. This means that even in isolation the part should fulfill its responsibilities.

Machinery is a great metaphor for this. A car a is full of components, many of these are made and tested in isolation by manufacturers across the world. Each component has a strict specification, so that when they are brought together at the assembly stage they can smoothly interact together, and form final product. Let's look at one part in particular: **the starter motor**.

#### The starter motor

![](/lib/images/2014-01-19-starter-motor.jpg)

The starter motor has one job: when a 12v current is connected at one end (expected input), the cog at the other end must spin (expected output). The user (the person assembling the car) need not be aware of the how the part does it's job, but just how to **provide the expected input** and **make use of the expected output**.

#### The &lt;video&gt; element

Let's jump to an example a little closer to home: the `<video>` element. This is a prime example of a component. It has an expected input: the `src` attribute, and and expected output: a playable video element. What goes on under the hood, is not really a concern to us as 'the user' of the component.

![](/lib/images/2014-01-19-video-element.png)

The `<video>` element is a little more complicated to  work with than the starter motor. Is has a larger interface and has many different states. Fortunately the component gives us a simple **public interface** to control it,

- `video.play()`
- `video.pause()`
- `video.load()`
- `video.canPlayType(format)`

And can tell us when its state changes via **events** that we can listen to using the standard `.addEventListener()` API,

- `'canplaythrough'
- `'ended'`
- `'error'`
- `'playing'`
- `'progress'`
- `'waiting'`
- `'loadedmetadata'`

These tools give us as 'users', full control over the `<video>` element without having to know any of it's internal makeup. To us **it's a black box, and this is a very good thing!**

### Making your own components

There are infinite ways to define components. You don't even need a framework or library to being working with components.

{% highlight javascript %}
var MyComponent = function() {
  this.el = document.createElement('div');
};

MyCompoent.prototype.render = function() {
  this.el.innerHTML = 'hello world';
};

// Create one
var component = new MyComponent();

// Render it
component.render();

// Put it in the DOM
document.body.appendChild(component.el);
{% endhighlight %}

Although simplistic, this vanilla approach has scope to get messy, and in large teams, believe me, it will!

At the *Financial Times* we wrote a library called [FruitMachine](http://github.com/ftlabs/fruitmachine) to do the job of defining and assembling our view components. [FruitMachine](http://github.com/ftlabs/fruitmachine) established team conventions and guaranteed interoperability of components.

The same component created using FruitMachine would look like,

{% highlight javascript %}
var MyComponent = fruitmachine.define({
  name: 'my-component',
  template: function() {
    return 'hello world';
  }
});

// Create one
var component = new MyComponent();

// Render it
component.render();

// Put it in the DOM
component.appendTo(document.body);
{% endhighlight %}

### Why build our own?

There are many pre-existing libraries we could have chosen to do the job of managing our layouts, but we had some specific requirements:

1. New components need to easily work alongside old legacy code.
2. Layouts need to be able to be rendered as strings on the server-side.
3. Should have the ability to define layouts as an arbitrary collection of components.
4. No large dependencies (eg. jQuery).

### Retro-fitability

Large applications tend to live for a long time. Code bases grow, and as a result complete application re-writes become unfeasibly expensive. It is beneficial with these kind of applications to be able to introduce new architectural changes incrementally, so this was a big requirement for our component library.

To achieve this, a view library has to be relatively un-opinionated about the rest of my application, so that it can be used alongside old code.

**Library weight** was also a concern. It is unlikely that the rest of your team will be happy with you experimenting with a new approach if it is costly to do so. Start small. Plant experimental seeds of change; if an experiment is a success, it will organically spread across the application.

FruitMachine started just like this. At first rendering only a tiny part of our application. Today, every view is rendered using it.

### Arbitrary layouts

The *Financial Times* web-app consists of many different pages. Each one of these pages are similar, but essentially different. The secret to managing all these pages is down to components.

We are able to have a single 'page controller' that can render all these different pages. The thing that differs is what we call the 'layout definition'. This is a JSON like representation of our view.

{% highlight javascript %}
{
  "module": "layout-a",
  "children": {
    "slot1": {
      "module": "header"
      "model": { "title": "My Web App" }
    },
    "slot2": {
      "module": "big-story"
      "model": {
        "title": "Story title",
        "body": "Story body..."
      }
    },
    "slot3": {
      "module": "small-stories"
      "model": [
        {
          "title": "Story title",
          "body": "Story body..."
        },
        {
          "title": "Story title",
          "body": "Story body..."
        },
        {
          "title": "Story title",
          "body": "Story body..."
        }
      ]
    }
  }
}
{% endhighlight %}

If we feed this definition to FruitMachine, it will spit out a fully formed view ready to drop into the DOM.

{% highlight javascript %}
var layout = fruitmachine(layoutJSON);

layout
  .render()
  .appendTo(document.body);
{% endhighlight %}


### Server-side rendering




### Styling components

Getting all your components onto the page, rendered with the correct content is just half the job. We've still got to style them.

CSS is a hard beast to tame, but 'componentising' your CSS just like your JS can make life a lot easier! When working with complex apps I have always used the [SASS](http://sass-lang.com) pre-processor. This is of course not a requirement when working with components, I would just recommend it.

For each component we create a `.scss`. This file will live in a flat directory alongside all our other components. We don't attempt to group or categorize anything, all components are created equal!

![](/lib/images/2014-02-08-style-sheets.jpg)

Next we need to get on and start styling our component, our main priorities here are **supporting transportability** and **preventing leakage**. Currently the only way we can achieve this is by pure discipline. Further down the road, we should be able to depend on new techniques of style encapsulation via 'Shadow DOM' and 'Scoped-stylesheets', but for now, we're kind of alone.

Consider the following component:

{% highlight html %}
<article>
  <h1>Headline<h1>
  <p>Body content</p>
</article>
{% endhighlight %}

One option for styling this would be:

{% highlight css %}
article {
  padding: 1rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}
{% endhighlight %}

This is a style leak nightmare! Those three rules will affect every other `<artice>`, `<h1>` and `<p>` in your application. Think of those rules as `window` globals in JavaScript. We have learnt to use closures to limit the scope of our variables in JavaScript; in CSS there is no concept of scope, so we need to fake it.

Let's add some classes to these elements to differentiate them from the those of the same `tagName`.

{% highlight html %}
<article class="my-article">
  <h1 class="headline">Headline<h1>
  <p class="body">Body content</p>
</article>
{% endhighlight %}

And style them:

{% highlight css %}
.my-article {
  padding: 1rem;
}

.my-article .title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.my-article .body {
  margin-bottom: 1rem;
}
{% endhighlight %}

It's nothing complex, but disciplined convention has given us the illusion of 'scope'. My styles will no longer leak and impact components written by my team. But what this doesn't protect us against is poorly written styles by other team members or third-parties.

Suppose another developer has carelessly written:

{% highlight css %}
.title {
  color: red;
}
{% endhighlight %}

This class of common of class names will result in my component turning red. We must protect ourselves from this carelessness!

{% highlight html %}
<article class="my-article">
  <h1 class="my-article_headline">Headline<h1>
  <p class="my-article_body">Body content</p>
</article>
{% endhighlight %}

{% highlight css %}
.my-article {
  padding: 1rem;
}

.my-article_title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.my-article_body {
  margin-bottom: 1rem;
}
{% endhighlight %}

There is now a very high probability our classes are unique, and we have prevented leakage and being leaked upon.

Using prefixed classes negates the need for parent selectors, this means that the elements within our component are **portable**. We can change our markup structure are not have to worry about updating our CSS., this speeds up development.

#### Summary

1. Use the component name as the class of the component's root element.
2. Prefix all sub-elements like `component-name_*` to prevent (and protect from) leakage.
3. Avoid polluting the global scope with generic class and tag selectors.

### Plugins



### Intro

#### What is a 'component'?

- Small self contained piece of UI
- Self-contained mini apps
- Apps are an assembly of components

#### What are the advantages?

- Team members can develop without treading on each others' toes.
- Components are reusable and portable.
- Decoupled and untangled.

### Working with components


#### Gluing components together

- Events
- Configuring with options

#### Responsive components

- Media queries aren't always enough

#### Performant components

- Harmonising thrashing components
- Layout boundaries

### The future of components

- Web Components
- Polymer
- x-tags
- Brick
