---
layout: post
title:  "The Weak Security Of The Portuguese Government's Authentication System"
description: The weak security of Autenticacao.gov.pt and Chave Movel Digital. This is part one of a series of blog posts that explores the weak security and various vulnerabilities found in the Portuguese Government's secure authenticate system.
tags: [chave movel digital, cmd, digital mobile key, portugal, authentication, vulnerability]
date:   2018-05-13 16:00:00 -0000
---

* **Part 1 - The Weak Security Of The Portuguese Government's Authentication System**
* [Part 2 - Chave Móvel Digital Multiple XSS Vulnerabilites](/chave-movel-digital-xss)
* [Part 3 - Chave Móvel Digital Phone Number Leakage](/chave-movel-digital-phone-number-information-leakage)
* [Part 4 - Chave Móvel Digital Log Out Not Working](/chave-movel-digital-does-not-log-out)

# Introduction

Back in January 2018, after about half an hour of exploring
the "secure" authentication system provided by the Portuguese government
I found various security issues and vulnerabilities. I will briefly
explore them in a series of blog posts.

In this first blog post I will explain what is `autenticacao.gov.pt` and
*Chave Móvel Digital*, as well as the sensitive information that they
are supposed to be restricting the access too. I will also explore the
overall weak security that the system has.

This whole series of blog posts is a result of my findings in a short
period of time. It's a compilation of the notes that I took, as a draft
to be submitted to responsible agency, as part of responsible disclosure.
A more thorough security audit is likely to reveal a lot
more problems. If about 30 minutes is all to took to find those problems,
what more would a malicious, motivated attacker would find.

I'm hoping that the issues will be fixed as soon as possible.


# Responsible Disclosure

On January 21st I emailed `ama@ama.pt` (email of the responsible agency),
describing the vulnerabilities and security issues, as well as offering
a more detailed description draft and Proof-Of-Concept code, but
obtained no answer.

# What Is Autenticacao.gov.pt and Chave Movel Digital (CMD)?

[Autenticacao.gov.pt's homepage](https://autenticacao.gov.pt) has the
following text:

```
O sítio oficial dos meios de identificação eletrónica,
assinatura digital e autenticação segura do Estado.
```

which translates to:

```
The official site of the means of electronic identification, digital signature
and state's secure authentication.
```

Basically, it's an authentication system that allows the Portuguese citizens
to authenticate to administrative public services. Once authenticated, you can, among other things:

* register a birth of a child
* register a vehicle
* register a company
* request a birth certificate
* obtain the criminal record of an individual or a company
* submit/consult revenue of an individual or a company
* sign documents

New functionalities are constantly added. As you can see, it is a very
useful system, since it allows you to save a lot of time. It allows you
to do many things from the comfort of your home and in minutes, instead
of spending hours at the pubic administrative services.

Despite being very useful, it does expose some sensitive personal
information and allows you to do some sensitive actions. If this
gets into the wrong hands, it can lead to many problems, such as
identity theft.

For this reason, it is very important to have a secure authentication system.
This is what *Chave Móvel Digital (CMD)*, which translates to Digital
Mobile Key, supposedly does. The main problem with it is that its security
is questionable.

# Bad Security From The Ground Up

So now let's briefly talk about the security of the *Chave Móvel Digital* authentication system.
In December of 2017 me and my girlfriend went to a Christmas fair. Among other
things, there were various company booths. One of them was VR-related, so
we decided to go in and check it out. After playing around with the Microsoft's
HoloLens for a little bit, we were approached by a lady there that asked us
if we have already activated the *Chave Móvel Digital* system. After
explaining to me what that was, she told me that it soon would be mandatory
to have it activated. I could either do it there now or go to the public
administrative organs, wait in queue for hours and do it there.

Motivated by the interest in the security of this new system and the potential
future time savings (bureaucracy is a big issue in Portugal), I decided
to activate it there.

### The Authentication Process

Let's look at the authentication process. To login using the *Chave Móvel Digital* system you have to enter your
mobile phone number and your PIN. If the entered details are correct, a
code is sent to your mobile number, which you have to enter to login.

The issues here are the following:

* PIN can only be 4-8 numeric digits
* SMS as the only second factor authentication option

The first one is the most serious one. PIN is essentially your password.
The issue here is that it only be **numeric** its length is **limited** to
be between 4 and 8 characters.

Let's look at the numbers. `8` digit numeric-only passwords means that
there are `10^8 = 100000000` possible combinations. This is nothing for
modern computer. For example, let's see how long will it take to generate
all of the possible combinations on my machine. Assuming that the file
`gen.py` contains the following code:

{% highlight python %}

# gen.py file contents
for i in range(0, 99999999):
    pass

{% endhighlight %}

Here is what `time python gen.py` gives us:

{% raw %}

$ time python gen.py
python gen.py  3.20s user 0.01s system 99% cpu 3.208 total

{% endraw %}

While this is not the most accurate way of measuring the process execution
time, it's good enough to transmit the idea of how easy this task is for
modern computers. It's `2018` and the Portuguese government
seems to think that 4 to 8 digit passwords are secure.

As an interesting note, when I was signing up with the system, the lady
told me that from her experience people usually choose `4` digit PINs, so
that they're the same as their phone PINs. This seems like a reasonable
assumption to take. In this case, the easy task is made even easier, since
the number of possible combinations is lowered to `10^4 = 10000`:

{% highlight python %}

# gen.py file contents
for i in range(0, 9999):
    pass

{% endhighlight %}

Here is what `time python gen.py` gives us:

{% raw %}

$ time python gen.py
python gen.py  0.01s user 0.01s system 98% cpu 0.015 total

{% endraw %}

Why can't you use passwords that contain numbers, letters and special
characters? Maybe it's a legacy issue, but you could definitely write some
middleware that would take care of that. The system is supposed to protect
very sensitive data, after all.

As an example, let me present to you a very simple solution that would make
the system more secure. It would do it so by allowing the users to use
a password that consists of numbers, letters and special characters, while
keeping the core legacy backend unchanged. I'm going to take the following
assumptions:

* the backend requires a 4-8 digit `PIN`
* all of the PINs are stored in plain text

A very simple solution would be to do the following:

1. When the user is registering/changing his password: hash the password provided by the user with the phone number and store it in the database. Generate an digit PIN and store it. This PIN will never be revealed to the user.
2. When the users tries to log in: hash the provided password with the phone
number and compare this result to the one that you have stored in the
database.
  * if they are equal, send an "OK" to the backend, which will then
  obtain the PIN from the database and use it as needed
  * if they are not equal, fail the authentication

I am in no way suggesting that this is the best solution, because it is not.
It is, however, a very simple one, that would require very little changes
to the overall system and keeping the core legacy backend unchanged.
All you would have to do is add a new table to the database (this way you
  will keep your existing tables unchanged) for the password hash and
change the authentication code in the middlware between the client and the
backend system. Even if the system is different from the one in my assumptions,
you can adopt the solution with relative ease.

The second point relates to only allowing SMS as the second-factor
authentication. While being a lot better than not using two-factor
authentication at all, it's not the most secure option.
Let me give you two examples. By using some social engineering, if an attacker
can get access to your personal information, they can contact your phone
company and move your phone number to a new SIM. By exploiting the [vulnerabilities in the
SS7 protocol](https://www.theguardian.com/technology/2016/apr/19/ss7-hack-explained-mobile-phone-vulnerability-snooping-texts-calls) the attacker can
read all of your text messages.

Allowing the use of other authentication options, such as Google Authenticator
would make the second-factor authentication a lot more secure. In general,
I have a feeling that the engineers assumed that there was no need for
strong passwords, since two-factor authentication is required and
only the user has the access to his mobile phone number. This assumption
is, of course, incorrect. While it is true, that if you're using a **good
second-factor authentication**, it's safe to weaken your password,
this does not apply to making your password a trivial 4-8 digit one.

Now, this just smelled **bad security**. I was certain that I could more problems. I was correct. The security issues that I'm going to be describing in this series of blog posts were found after about 30 minutes of
exploring.

There is now an option to receive your second-factor code
as a private message on Twitter or be sent to your e-mail address. Those
are not enabled by default and you have to do it yourself. I am not
sure when those options were added. In any case,
when logging in into your "Personal Area", you only have the option of
using your mobile phone number.

# Conclusion

In this first post of the four-part series I described why the security
of the authentication system is flawed. This is also what motivated me
to explore further: I was sure that it wouldn't be hard to find more issues,
since the "security" of this "secure authentication system" did seem
like an afterthought.

In the [next blog post](/chave-movel-digital-xss), I will be describing the multiple XSS vulnerabilities
present in the authentication page.
