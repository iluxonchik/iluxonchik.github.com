---
layout: post
title:  "XSS Vulnerability, Unlimited Password Attempts and Weak Security Of Autenticacao.gov.pt"
description: A comprehensive technical overview of the SSL/TLS protocol.
tags: [ssl, tls, tls 1.2, protocol, explanation]
---

# Introduction

In this blog post I will be covering multiple vulnerabilities that
I found in a little more than 10 minutes of exploring the "secure"
authentication system provided by the Portuguese government.

## Bad Security From The Beginning

* PIN only 4-6 numeric digits
* SMS as the only second factor auth

# XSS

This is how the main login page looks like:

{% include figure.html url="../images/posts/aut_gov_vuln/login_page.png" num="1" term=":" description="Digital Mobile Key login page" %}

To login to the portal, you need to enter your mobile phone number and a
numeric `PIN`. The `Mobile phone number` field is the one that will be used
to exploit the `XSS` vulnerability. Throughout this section I will be using
`1234` as the `PIN` number.

Now let's see what happens when I try to enter a phone number that consists
only of letters (`Hello, World"`):

{% include figure.html url="../images/posts/aut_gov_vuln/enter_text.png" num="1" term=":" description="Digital Mobile Key login page" %}

And now let's click on "Authenticate":

{% include figure.html url="../images/posts/aut_gov_vuln/enter_text_authenticate.png" num="1" term=":" description="User input gets copied without validation" %}

Even though the page says `The phone field only allows numbers`, at the bottom, it
still copies the input that I provided verbatim to the same field.
At this point I was pretty sure that the page is vulnerable to `XSS`.
So I looked at the source code to see how it can be exploited:

{% include figure.html url="../images/posts/aut_gov_vuln/value_attr_input.png" num="1" term=":" description="The input is copied to the value attribute" %}

Okay, so the input is you provided initially is copied to the `value`
attribute of the `inputMobile` element. So let's try to show a very simple
`XSS` that would inject a new `span` element into the page and would comment
out some of the `HTML`. For this, in the `Mobile phone number` field, we'll
input the following text: `" <span> Hello, World </span> <!--`.

{% include figure.html url="../images/posts/aut_gov_vuln/xss_input.png" num="1" term=":" description="A simple XSS input" %}


And here is the result:

{% include figure.html url="../images/posts/aut_gov_vuln/xss_result.png" num="1" term=":" description="Successful result of an XSS injection" %}


As you can see, our custom `HTML`was successfully injected into the page.
The rest of the page wasn't commented out only because there is another
closing `HTML` comment tag (`-->`) present in the page's source.

{% include figure.html url="../images/posts/aut_gov_vuln/xss_source.png" num="1" term=":" description="Resulting HTML from the XSS attack" %}


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

{% include figure.html url="../images/posts/aut_gov_vuln/manual_change.png" num="1" term=":" description="Manually changing the value of the hidden input " %}

{% include figure.html url="../images/posts/aut_gov_vuln/manual_change_result.png" num="1" term=":" description="The hidden input value is the one that gets echoed back" %}

# Unlimited Login Attempts

Another thing that I've noticed was that there was no protection
against the number of login attempts whatsoever. This means that you
can easily bruteforce a `PIN` of any user, since it's a numeric value with
only `4` to `6` digits.

This went against what I was told when I activated the "Digital Mobile Key"
system, since I was assured that the number of login attempts per
mobile number is limited.

To show this, I wrote a simple Proof Of Concept (POF) in Python. Please note,
that this can be optimized a lot, but due to the lack of time I didn't go
into optimizing this down to individual requests.



A quick reverse-engineering of the authentication process showed that
in order to access the login page, you need to go thought a specific
sequence of steps, you can't just go to the login page directly.

In that sequence of steps, you're sending and receiving various
cookies. Among those, there are `3` different session ids that you
get through this process and a request that checks if your browser supports JavaScript.

In order to access a page, you need to do a `GET` request with a `RequestId` parameter:

{% include figure.html url="../images/posts/aut_gov_vuln/get_requestid.png" num="1" term=":" description="GET request to access the login page" %}

A `GET` with the `RequestId` and a `Cookie` is sent. Since the website
uses `ASP.NET` and I have experience with the `.NET`framework, I
immediately recognized the 'RequestId' as being an [UUID structure](https://msdn.microsoft.com/en-us/library/windows/desktop/aa379358.aspx).

With every `POST` request a `humanCheck` value is sent. This value is
set on document load:

{% highlight js %}
$(document).ready(function () {
            $('#humanCheck').val('8FBB298A-DE46-4657-88E8-95F1F1224784');
            $("#inputMobile").intlTelInput();
        });
{% endhighlight %}

Now, when writing the `POF` bot, I thought that that was a unique
value generated on every request, acting as a nonce. But I was
surprised, and not in a good way: this value is fixed. I've tried
with different IP's, different browsers, the value remained the
same:

I was in disbelief, I even resorted to comparing the strings
computationally, who knows, maybe I was missing something. But no,
the JavaScript code above seemed to be totally fixed, unless the
value is based on something like the month, but that does not
change the narrative: this is equivalent to considering it fixed.

{% raw %}
Python 3.6.4 (default, Dec 23 2017, 19:07:07)
[GCC 7.2.1 20171128] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> str_1 = '8FBB298A-DE46-4657-88E8-95F1F1224784' # Firefox, US IP
>>> str_2 = '8FBB298A-DE46-4657-88E8-95F1F1224784' # Chrome, PT IP
>>> str_1 == str_2
True
{% endraw %}

Each request to an authentication attempt does not provide you
with any new, unique cookies either.

I also found a way to discover if a phone number is registered
or not. If it's not registered, there is not limit to the number
of attempts that you can make. If it is,there are. This makes
the ambiguous message "Either you phone number or PIN are wrong"
useless, since you can easily find that out.
