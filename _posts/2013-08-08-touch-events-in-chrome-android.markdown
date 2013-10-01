---
layout: post
title:  "Touch events in Chrome Android"
date:   2013-08-08 12:24
tags: chrome android javascript
---
Today I came across some odd behaviour in Chrome Android. In our app we have a module that is responsible for listening for user touch events and responding by panning or swiping to the next page.

In Chrome Android our 'touchmove' event callback seemed not to be firing at all, and as a result the panning and swiping feature of our app was broken. After doing a quick timeline in Chrome Dev Tools I could see three events firing: 'touchstart', 'touchmove' and 'touchcancel'. Wait ... 'touchcancel' wat?!

I sent out a plea for help on Twitter, thankfully [https://twitter.com/gauntface](Matt Gaunt) (Google Chrome) sent me this advice:

<blockquote class="twitter-tweet">
<p><a href="https://twitter.com/wilsonpage">@wilsonpage</a> There is a 200ms delay that you need to call e.preventDefault() in. However, the 200ms delay is dependant the time the system ..</p>
<div>&mdash; Matt Gaunt (@gauntface)</div>
<div><a href="https://twitter.com/gauntface/statuses/365137909680046080">August 7, 2013</a></div>
</blockquote>
<script charset="utf-8" src="//platform.twitter.com/widgets.js" type="text/javascript"></script>

### Why was Chrome cancelling my touch events?

From [https://code.google.com/p/chromium/issues/detail?id=260732](this bug report), it seems as though it's for performance reasons. Chrome probably wants to handle the touches for browser default events such as scrolling without the complication of handling any custom logic.

### What's the problem?

In order to listen to the touch events in Chrome Android I have to call `event.preventDefault();`. If I 'prevent default' I am effectively say to the browser "leave this event alone, I'm handling it".

This is fine, except we now lose the option of native `overflow: scroll;` within any element that may reside within the element I'm listening for touches on. Preventing default on a 'touchstart' or 'touchmove' event will prevent any scrolling that would have been handled by the browser from occurring.

In my app I wanted horizontal panning and swiping of pages to be handled by JavaScript and vertical scrolling to handled natively by `overflow: scroll;` or `-webkit-overflow-scrolling: touch`. In Chrome Android (unlike other browsers) this is appears not to be possible.

### A work around

To achieve the desired result I will now have to use synthetic JavaScript powered scrolling for both horizontal panning and swiping as well as vertical scrolling. I may choose to do this just for Chrome Android so as to get the performance benefits of native scrolling on other platforms.

### Looking forward

I understand handling custom and default responses to touch event must be a tricky one to manage for browsers. I'm just writing this up to highlight a use case that requires both responses. Microsoft's `[http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx](-ms-touch-action)` property from the [http://www.w3.org/Submission/pointer-events/](Pointer Events spec) does a good job giving developers control over how touches are handled by the browser, and could end up working its way into the other major browsers.