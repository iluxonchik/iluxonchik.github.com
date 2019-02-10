---
layout: post
title:  "Chave Móvel Digital Multiple XSS Vulnerabilities"
description: Multiple Reflected Cross-Site-Scripting (XSS) vulnerabilities found in the Portuguese government's Chave Móvel Digital authentication system.
tags: [security]
date:   2018-05-13 16:00:01 -0000
---

* [Part 1 - The Weak Security Of The Portuguese Government's Authentication System](/weak-security-of-portuguese-government/)
* **Part 2 - Chave Móvel Digital Multiple XSS Vulnerabilites**
* [Part 3 - Chave Móvel Digital Phone Number Leakage](/chave-movel-digital-phone-number-information-leakage)
* [Part 4 - Chave Móvel Digital Log Out Not Working](/chave-movel-digital-does-not-log-out)

# Introduction

In this blog post, I will be exploring the Reflected Cross-Site-Scripting (XSS) vulnerability present in the Portuguese government's authentication
system's website [www.autenticacao.gov.pt](https://www.autenticacao.gov.pt/).

The XSS vulnerability is present in the *Chave Móvel Digital* (CMD) login page.


# The XSS Vulnerability

At the moment of writing this post, there are 3 ways that you can authenticate
yourself:

* the second-factor code is sent to your mobile phone number
* the second-factor code is sent to your e-mail
* the second-factor code is sent to your as a private Twitter message


{% include figure.html url="../images/posts/aut_gov_vuln/auth_opts.png" num="1" term=":" description="Chave Movel Digital Authentication Options" %}

I'm going to choose the phone number authentication method, since
this is the only one that's required. The other two are not activated by
default. The XSS vulnerability seems to only work on the
mobile phone number and Twitter authentication methods. E-mail authentication
seems to be doing input sanitization correctly. There are two separate places where you can login:
the "Personal Area", which only allows mobile phone number login, and the
regular one, which allows the 3 authentication methods described above.
The XSS vulnerability works in both places.

This is how the main login page looks like:

{% include figure.html url="../images/posts/aut_gov_vuln/login_page.png" num="2" term=":" description="Digital Mobile Key login page" %}

To login to the portal, you need to enter your mobile phone number and a
numeric `PIN`. The `Mobile phone number` field is the one that will be used
to exploit the `XSS` vulnerability. Throughout this section I will be using
`1234` as the `PIN` number.

Now let's see what happens when I try to enter a phone number that consists
only of letters (`Hello, World"`):

{% include figure.html url="../images/posts/aut_gov_vuln/enter_text.png" num="3" term=":" description="Digital Mobile Key login page" %}

And now let's click on "Authenticate":

{% include figure.html url="../images/posts/aut_gov_vuln/enter_text_authenticate.png" num="4" term=":" description="User input gets copied without validation" %}

Even though the page says `The phone field only allows numbers`, at the bottom, it
still copies the input that I provided verbatim to the same field.
At this point I was pretty sure that the page is vulnerable to `XSS`.
So I looked at the source code to see how it can be exploited:

{% include figure.html url="../images/posts/aut_gov_vuln/value_attr_input.png" num="5" term=":" description="The input is copied to the value attribute" %}

Okay, so the input is you provided initially is copied to the `value`
attribute of the `inputMobile` element. So let's try to show a very simple
`XSS` that would inject a new `span` element into the page and would comment
out some of the `HTML`. For this, in the `Mobile phone number` field, we'll
input the following text: `" <span> Hello, World </span> <!--`.

{% include figure.html url="../images/posts/aut_gov_vuln/xss_input.png" num="1" term=":" description="A simple XSS input" %}


And here is the result:

{% include figure.html url="../images/posts/aut_gov_vuln/xss_result.png" num="6" term=":" description="Successful result of an XSS injection" %}


As you can see, our custom `HTML`was successfully injected into the page.
The rest of the page wasn't commented out only because there is another
closing `HTML` comment tag (`-->`) present in the page's source.

{% include figure.html url="../images/posts/aut_gov_vuln/xss_source.png" num="1" term=":" description="Resulting HTML from the XSS attack" %}

Below is a video demonstration of how this vulnerability can be exploited
to inject arbitrary JavaScript code into the page.

<iframe width="560" height="315" src="https://www.youtube.com/embed/jG8ZWBNqRyg?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Whenever the text in the "Mobile phone number" field is
changed, the `ShowPrint()` function is called. The only thing that it does is
copies the value from the `inputMobile` element to the `MainContent_hiddenMobile` attribute:

{% highlight js %}
function ShowPrint() {
            var mobileValue = document.getElementById("inputMobile").value;
            document.getElementById("MainContent_hiddenMobile").value = mobileValue;
            return true;
        }
{% endhighlight %}

Why this is done is not obvious, since both of the fields get `POST`ed to the
the backend when you click on "Authenticate":

{% include figure.html url="../images/posts/aut_gov_vuln/form_data.png" num="1" term=":" description="Both of the attribute values get sent" %}

However, if we manually change the value of the `MainContent_hiddenMobile`
field to `Hello, Reader` and leave `Hello, World` in the `inputMobile`
field, we can see that the value that that's placed in the "Mobile phone number" box in the failed login page is the one from `MainContent_hiddenMobile`.

{% include figure.html url="../images/posts/aut_gov_vuln/manual_change.png" num="7" term=":" description="Manually changing the value of the hidden input " %}

{% include figure.html url="../images/posts/aut_gov_vuln/manual_change_result.png" num="8" term=":" description="The hidden input value is the one that gets echoed back" %}

# Conclusion

In this blog post I showed you the `POST` XSS vulnerability present
in the Portuguese government's `autenticacao.gov.pt` *Chave Móvel Digital*
login page.

In the [next blog post](/chave-movel-digital-phone-number-information-leakage) I will show you how you can find out if a
mobile phone number is registered with *Chave Móvel Digital* or not,
making the existing ambiguous "Either the mobile number or the PIN are
incorrect" message useless and opening the door for various social
engineering attacks.
