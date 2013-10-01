---
layout: post
title:  "Redirecting posts from Tumblr"
date:   2013-10-01 10:29
tags: tumblr blogs
---
As you may or may not know I have recently migrated my blog from Tumblr to a custom Jekyll solution hosted on GitHub pages. My main issue was redirecting traffic from old links to my new domain and URL schema. The URL change was as follows:

`wilsonpage.tumblr.com/posts/<POST-ID>/<POST-TITLE>` => `wilsonpage.co.uk/<POST-TITLE>`

For obvious reasons Tumblr doesn't really help you out with this. That meant we have two solutions:

1. JavaScript redirects (`window.location.href = 'http://example.com';`)
2. Meta refresh redirects (`<meta type="refesh" content="0;'http://example.com'" />`)

The former is not ideal as crawlers/bots are unlikely to follow JavScript redirects. The later is tricky as tumblr doesn't give me the ability to manipulate strings in their templating language to allow me to transform the Tumblr URL into my new URL. I needed the ability to dynamically transform the old URL into the new URL on the server-side, or just somehow define a server-side variable for the new URL manually for each post.

### Solution

The only variables I could define myself were the post Title and Body. I decided to abuse the Post Title as my own custom variable.

[Insert image of changing post title]

I can use my custom variable inside the page html template as the URL path inside the meta refresh tag.

[Insert image of changing custom html]

If the page is a post page the user is redirected to `wilsonpage.co.uk/<POST-TITLE>`. If it's not a post page, they are simply redirected to `wilsonpage.co.uk`.

Fortunately this didn't require much work on my part as I didn't have that many posts to migrate. It doesn't really matter that the Tumblr post titles are not as pretty now, as no-one will be reading them anyway.

I think this is an adequate work around for the lack of URL migration facilities from Tumblr. Over time there will be fewer old links around, and I should be able to close the TUmblr blog all together.