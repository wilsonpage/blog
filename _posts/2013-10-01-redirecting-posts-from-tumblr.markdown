---
layout: post
title:  "Redirecting posts from Tumblr"
date:   2013-10-01 10:29
tags: tumblr blogs
---
As you may know I have recently migrated my blog from [Tumblr](http://tumblr.com) to a custom [Jekyll](http://jekyll.org) solution hosted on [GitHub Pages](http://pages.github.com). My main issue was redirecting traffic from old links to my new domain and URL schema. The URL changed as follows:

`wilsonpage.tumblr.com/posts/<POST-ID>/<POST-TITLE>` => `wilsonpage.co.uk/<POST-TITLE>`

For obvious reasons Tumblr doesn't really help you redirecting away from their site. This means we have two solutions:

1. JavaScript redirects (`window.location.href = 'http://example.com';`)
2. Meta refresh redirects (`<meta type="refesh" content="0;'http://example.com'" />`)

The former is not ideal as crawlers/bots are unlikely to follow JavScript redirects. The later is tricky as tumblr doesn't give me the ability to manipulate strings in their templating language to allow me to transform the Tumblr URL into my new URL. I needed the ability to dynamically transform the URL on the server-side, or just manually define a server-side variable containing the new URL for each post.

### My solution

The only variables I could define myself were the post Title and Body. I decided to abuse the Post Title as my own custom variable.

[Insert image of changing post title]

I can use my custom variable inside the page html template as the URL path inside the meta refresh tag.

[Insert image of changing custom html]

If the page is a post page the user is redirected to `wilsonpage.co.uk/<POST-TITLE>`. If it's not a post page, they are simply redirected to `wilsonpage.co.uk`. It doesn't really matter that the Tumblr post titles are not as pretty now, as no-one will be reading them anyway.

I think this is an adequate work around for the lack of URL migration facilities from Tumblr. Fortunately this didn't require much work on my part as I didn't have that many posts to migrate. Over time there will be fewer old links in the wild, and I should be able to close the Tumblr blog all together. The most important thing is that old links continue to arrive at my content.