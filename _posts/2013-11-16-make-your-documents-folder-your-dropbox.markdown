---
layout: post
title: "Make your Documents folder your Dropbox"
date: 2013-11-16 17:25:00
tags: workflow mac osx
---

I recently purchased a premium Dropbox account to make working across multiple machines a little easier. I didn't want to have to think about what and when to move stuff into my Dropbox, I just wanted my `Documents` folder to _be_ my Dropbox.

### 1. Move your Documents into Dropbox

First you need to copy any existing contents of your `Documents` directory into a new directory inside your Dropbox folder named 'Documents'.

<img class="no-border" src="/lib/images/make-your-documents-folder-your-dropbox-1.png" />

### 2. Delete your Documents directory

Now your `Documents` directory empty is empty we need to delete it. OSX won't let you do this from finder so we have to go open terminal.

{% highlight bash %}
$ sudo rm -rf ~/Documents
{% endhighlight %}

### 3. Link your Dropbox Documents

Now we create a 'symlink' (or 'alias') of the new `~/Dropbox/Documents` directory back to the original Documents locations.

{% highlight bash %}
$ ls -s ~/Dropbox/Documents ~/Documents
{% endhighlight %}

<img class="no-border" src="/lib/images/make-your-documents-folder-your-dropbox-2.png)" />

That's all there is to it.
