---
layout: post
title: "The perfect AMD setup"
date: 2015-01-17 12:00:00
tags: javascript modules requirejs
---

I've been using AMD modules (*RequireJS*) for various projects for a while. It has some advantages over 'CommonJS' (ie. *Browserify*) solutions, but has additional complexity around package installation.

One thing I disliked about AMD was having to maintain a large `paths` config to resolve third-party package sub-dependencies. Here's an example of one of these:

{% highlight javascript %}
require.config({
  baseUrl: '/js',

  // 'paths' lets us alias complex
  // paths to something simpler and
  // resolve sub-dependency require paths
  paths: {
    'debug': '../bower_components/debug/index',
    'attach': '../bower_components/attach/index',
    'model': '../bower_components/model/index',
    'view': '../bower_components/view/index',
    'evt': '../bower_components/evt/index',
    'drag': '../bower_components/drag/index',
    'device-orientation': '../bower_components/device-orientation/index',
    'gaia-header': '../bower_components/gaia-header/gaia-header',
    'gaia-icons': '../bower_components/gaia-icons/gaia-icons',
    'gaia-component': '../bower_components/gaia-component'
  }
});
{% endhighlight %}

This config means that anywhere in my app code or third-party code I will be able to call `require('gaia-component')`, and it'll actually require `js/bower_components/gaia-component`, under the hood.

As `gaia-component` is a dependency of the `gaia-header` module, this path config must be in place, otherwise `gaia-header` will error.

### Installation process

*Bower*/*AMD* package installation process is involved and error prone:

1. `$ bower install cool-package`
2. Search through source code of `cool-package` and identify any sub-dependency `require()`s.
3. Amend the `require.config` paths to map any sub dependency paths to their correct locations.
4. Run app, on failure return to step 2.

By contrast the NPM installation process is dreamy:

1. `$ npm install cool-package`
2. `require('cool-package');`

The good news is there's a better solution for *Bower* and AMD users which enables:

1. `$ bower install cool-package`
2. `require('cool-package');`

Seamlessly resolving any nested `require('some-sub-dependency')`. Read on, all will be revealed...

### A better solution

I was discussing this problem with [James Burke](http://twitter.com/jrburke) and he kindly wrote a small command-line tool called '[adapt-pkg-main](http://github.com/jrburke/adapt-pkg-main)' to help. The documentation in the repo is thorough, but I'll try to outline briefly how it works.

#### Step One: Package main adapters

[*Adapt-pkg-main*](http://github.com/jrburke/adapt-pkg-main) will look for packages in a given packages directory (eg. `bower_components/`). For each package in the directory it will look for a package description file (eg. `bower.json`, `package.json`). Both `bower.json` and `package.json` have the convention of a `"main"` attribute which declares the package's entry point (eg. `cool-package/cool-package.js`).

[*Adapt-pkg-main*](http://github.com/jrburke/adapt-pkg-main) will use this `"main"` value to create a new 'adapter' module for each package like so:

**Main file:** `bower_components/cool-package/cool-package.js`<br/>
**Created adapter:** `bower_components/cool-package.js`

The `cool-package.js` adapter is AMD by default, but this 'adapterText' [can be configured](https://github.com/jrburke/adapt-pkg-main#options):

{% highlight javascript %}
define(['./cool-package/cool-package'], function(m) { return m; });
{% endhighlight %}

#### Step Two: `require.config`

The second part of the trick is to configure *RequireJS* to assume all unprefixed paths to look in `bower_components`.

{% highlight javascript %}
require.config({
  baseUrl: 'bower_components',
  paths: { root: '../' }
});

require(['root/app'])
{% endhighlight %}

After this one-time configuration, paths will be resolved as follows:

- `require('cool-package')` -> `bower_components/cool-package.js`
- `require('some-sub-dependency')` -> `bower_components/some-sub-dependency.js`
- `require('./lib/foo')` -> `CURRENT_MODULE_DIR/lib/foo.js`
- `require('root/app')` -> `/app.js`

You'll notice that the unprefixed paths now resolve to the adapter files that `adapt-pkg-main` created, so the full resolution (via the adapter module) will look like:

`require('cool-package')` -> `bower_components/cool-package.js` -> `bower_components/cool-package/cool-package.js`

### Path convention

Once you have this require configuration, it makes sense to use relative style paths whenever you're requiring a file that doesn't live in `bower_components/`, otherwise it'll have to prefixed with `root/`. Just write your `require()` paths exactly as you would in Node.

### Automation

It makes sense to plug the adapter creation step into a *Bower* `postinstall` hook so we can forget all about it. Create a `.bowerrc` file at the root of you project (if you don't already have one) with the following:

{% highlight json %}
{
  "scripts": {
    "postinstall": "npm run apm"
  }
}
{% endhighlight %}

### Profit

Drop a comment if you have any questions or improvements :)

`bower install sweet-dreams`<br/>
`require('sweet-dreams');`
