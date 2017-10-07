---
layout: post
title:  "SSL/TLS Overview"
description: A comprehensive technical overview of the SSL/TLS protocol.
tags: [ssl, tls, tls 1.2, protocol, explanation]
---

{% include figure.html %}

# Introduction

SSL/TLS is one of the most used and important protocols nowadays.

# Prerequisites, Scope and Audience

I will be concentrating on the SSL/TLS protocol itself and won't be describing
the concepts it relies on in great detail. I'm assuming you're already
familiar with the following concepts:

* public key cryptography
* symmetric cryptography
* X509 certificates
* certificate chains
* Diffie-Hellman
* TCP
* packet structure

With that said, you **don't** need to know any of the topic above in detail
and you should be able to follow everything after having a 5-10 minute read
about the topics you're not familiar with.

My advice to you is even if you're not comfortable with everything on the list
above, keep on reading. If you encounter something you don't understand: Google it.
Trust me, you'll learn a lot in this way.

This blog post is written for everyone: whether you are a developer
wanting to implement SSL/TLS from scratch or you're just a curious person
who wondered what's the difference between `http` and `https`, and what that
`s` stands there for (spoiler alert: it stands for "secure", as in "secure `http`"
or "secure hypertext transfer protocol", if you wish).

## Terminology

Here, I will provide succinct, informal descriptions of some of the terms you'll
find throughout the blog post.

* [RFC (Request For Comments)](https://en.wikipedia.org/wiki/Request_for_Comments) - document describing methods, behavior, research or innovations that are applicable to Internet and its systems. They are submitted for peer review or to convey new concepts or information. Some of the RFCs become standards. As an example, it's in the RFC's that you find the specifications of the SLL/TLS protocols, it's where you can find standards on how you should extend the TLS protocol, it's also where you can find [what the words like "must" and "should" mean when used in an RFC](https://www.ietf.org/rfc/rfc2119.txt).
[IETF](https://www.ietf.org/) is the entity responsible for RFCs.

* client/server - for example, when you access a website, like www.google.com, your web browser (**client**) connects to a computer which has the website's files (**server**). The **client** then proceeds to download the files from the **server** (files like `index.html`, image files that are then displayed on the web page, etc). So **client** is the entity that begins the communication and the **server** is the entity that
responds to that "begin communication" request. In case you're confused, think of the following scenario: you're accessing https://google.com/ from your Google Chrome browser:

    * **client** is **your web browser**
    * **server** is the **computer that has the files for http://google.com**

# SSL vs TLS: What's The Difference?

I want to address this topic straight away, since you the terms SSL, TLS and
SSL/TLS are used interchangeably and you might be confused, as I was once too.

SSL stands for "Secure Socket Layer", while TLS stands for "Transport Layer Security".
So what's the difference between SSL and TLS? Well, the protocol's name was changed
to "TLS" from "SSL", once it was standardized by the IETF.
SSL was a proprietary protocol, and IETF decided that it was a good idea to standardize it,
which resulted in [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt). SSL is
a proprietary protocol (owned by Netscape Communications), TLS is a non-proprietary,
standardized protocol.

Here's an image that will give you a visual of the version evolution of the SLL and TLS
protocols:

{% include figure.html url="../images/posts/ssl_tls_overview/ssl-tls-version-history-iluxonchik.png" num="1" term=":" description="SSL and TLS Protocols Version History" %}

SSL 1.0 was never actually released to the public and was only used inside the Netscape Communications,
since it had several security flaws and shortcomings. SSL 2.0 was the first publically
released version. At the moment of the writing of this post, TLS 1.2 is the most
recent version of TLS in use, TLS 1.3 is currently in draft status.

From here on, I will be using the terms **SLL**, **TLS** and **SSL/TLS** with their
appropriate meaning.

# A Little Bit Of History

Before diving into the technical details, let's begin with a little bit of history of the SSL/TLS protocol.
Mainly, we'll be discussing the evolution from `SSL 1.0` to `TLS 1.0`.
It all began in about 2000 BC, with the [early works in the field of mathematics](https://en.wikipedia.org/wiki/History_of_mathematics). No, no, wait...
that's too far back in the history. Let me take you back to 1994.
This year was very important in the history of computing, not only because that
that's the year I was born in, but also because that's when the SSL protocol had
its origins.

So we're in the early years of The World Wide Web (WWW) and just after 8 months after
the first popular Web browser (Mosaic 1.0) is released, Netscape Communications has completed
the design for SSL 1.0 (SSL version 1). What was the main motivation behind the creation of the protocol, you might ask?
Was it because from the early days of WWW there was a major concern in providing encrypted
communications, in order to protect everyone's privacy while browsing this huge
repository of information? Nah, it was because of money.

In the first half of the 1990s, people began buying items online. Credit cards were the
most common way of paying for those items. And what's the problems with that?
Well, `http` is not encrypted, so everything was sent in clear text, this means
that all of those credit card numbers and CVV's where visible to anyone who
intercepted the traffic and, therefore they could steal them.

In short, online shopping was not secure and since if it wasn't secure, people
wouldn't buy items online, which means less profit to both: banks and businesses,
so there was great motivation in creating something that would make Web transactions secure.

So let's get back to SSL. As I already mentioned, `SSL 1.0` was never actually released to the public,
its use was limited inside the Netscape Communications. This is explained by the fact
that it had varied security flaws and shortcomings: it isn't "the SSL" people usually refer to
when they talk about "SSL". As an example, it  **neither provided data integrity** guarantees,
nor it used sequence numbers, making it vulnerable to **replay attacks**. The lack
of integrity guarantees, combined with the fact that it used `RC4` stream cipher
for data encryption, allowed a potential attacker to **make predictable changes to the plaintext messages**.
The designers of SSL 1.0 did add checksums and sequence numbers later on, but [CRC](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) was used instead of a strong
[cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function).

In 1995, `SSL 2.0` was released by Netscape Communications and it was implemented in
their Netscape Navigator web browser. The problems mentioned above, as well as few
other were resolved: for example, CRC was replaced with [MD5](https://en.wikipedia.org/wiki/MD5), which was considered
to still be secure at that time. Netscape Communications filed a patent entitled "Secure Socket Layer Application Program Apparatus and Method", which basically described the SSL protocol in August 1995. They were granted the pattern in August of 1997.
You might think that they wanted it all for themselves only, but no, they actually gave the patent
away to the community for free use.

The Internet and WWW started to take off. This meant money, so naturally this lead other
companies to move into the same area. For example, Microsoft released a competitor to
SSL called [Private Communications Technology (PTC)](https://en.wikipedia.org/wiki/Private_Communications_Technology),
but it never really took off.

In November of 1996, the specification of the `SSL 3.0` protocol was finally published as
an [Internet Draft](https://www.ietf.org/id-info/). The document specifying the `SSL 3.0` protocol
is the [RFC 6101](https://tools.ietf.org/html/rfc6101). When people talk about "SSL", they usually
talk about `SSL 3.0` and the versions that came after it. Here are some of the problems that were corrected
in `SSL 3.0`:

* `SSL 2.0` allowed the client and the server to send only one public key certificate each,
which means that that it had to be directly signed by the CA. `SSL 3.0` allows **certificate chains of arbitrary length**
to be sent.

* `SSL 2.0` used the same keys for message authentication and message encryption, which may lead to problems in certain ciphers.
Another problem is that if `SSL 2.0` was used with `RC4` in [export mode](https://en.wikipedia.org/wiki/Export_of_cryptography_from_the_United_States) (this topic is briefly mentioned below), then both: the message authentication and encryption keys would be `40 bit` each, but export laws generally only apply to encryption and
not authentication, so longer keys can be used for authentication. In `SSL 3.0` **different keys** are used for encryption
and authentication, so the problems mentioned above are solved.

* `SSL 2.0` used cryptographic hash function `MD5` for `MAC` generation exclusively. In `SSL 3.0` `MD5` is
complemented with `SHA-1` and `MAC` construction is more sophisticated.

After the release of `SSL 3.0`, there was a lot of confusion in the security community:
from one side you had the Netscape Communications and a large part of the Internet and Web security
community pushing `SSL 3.0`, and from the other side there was Microsoft with their huge
install base pushing `PTC` and `STLP` (Secure Transport Layer Protocol). To solve this issue,
an IETF Transport Layer Security (TLS) Working Group (IETF TLS WG) was formed. Thus, in 1999, `TLS 1.0` was released.

Despite the name change, **TLS 1.0 is nothing more than a new verion of SSL 3.0**.
There are some differences between the two, but those are smaller than the ones between
`SSL 2.0` and `SSL 3.0`. In fact, `TLS 1.0` is sometimes called `SSL 3.1`. In addition
to the `TLS 1.0` protocol, the IETF TLS WG also released a released a series of extensions
to the `TLS` protocol which can be found in other RFCs.

In August 2006, `TLS 1.1` was released, fixing some cryptographic problems, among other things.
For example, the implicit `IV` was replaced with an explicit `IV` in order to protect from
some `CBC` attacks. Another change was that premature closes (i.e. if the TLS connection is closed without a proper `close_notify` alert) didn't make a `TLS` session non-resumable anymore.

A few years later, in 2009, `TLS 1.2` was released. Some of changes were:

* instead of using the hardcoded `MD5/SHA-1` combination in the Pseudo Random Funcion (PRF), the PRF to be used is now specified in the cipher suite.

* the `MD5/SHA-1` combination is the digital signature is replaced with a single has, which is negotiated during the handshake

* TLS Extensions definition and AES Cipher Suites were merged in from other RFCs (*i.e.* the TLS extension mechanism is now defined in the `TLS 1.2`s RFC, instead of being part of a separate [RFC 4366](https://tools.ietf.org/html/rfc4366))

This concludes the introductory section of this blog post and we will begin
diving into `TLS 1.2` in the next section.

# The TLS Protocol

In this section we'll be looking into the TLS protocol. While here we'll be
focusing on `TLS 1.2`, since it's the latest version of the protocol at the
time of writing of this post (`TLS 1.3` is currently in draft state), the
description below is valid for previous versions of `TLS` (`TLS 1.0` and `TLS 1.1`),
as well as `SSL 3.0` and vice-versa. This is due to the fact that the main parts
remain the same in all of them, there are differences in some parts, like
the supported cipher suites (some get removed, some get added), the generation of
the keying material (there are changes in the `Pseudo Random Function (PRF)` used,
and `Message Authentication Code (MAC)` generation), among others, but the
central ideas suffer very little change.

## Introduction

`Trasnsport Layer Security (TLS)` is a **client/server** protocol that runs on top of a
**connection-oriented and reliable transport protocol**, such as `TCP`. In the
[TCP/IP protocol stack](https://en.wikipedia.org/wiki/Internet_protocol_suite), the `SSL` and `TLS` protocols
are placed **between the Transport Layer and the Application Layer**, as shown in the image below:

{% include figure.html url="../images/posts/ssl_tls_overview/tls-in-tcp-ip-iluxonchik.png" num="2" term=":" description="SSL/TLS/DTLS Protocol Placement In The TCP/IP Protocol Stack" %}
