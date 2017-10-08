---
layout: post
title:  "SSL/TLS Overview"
description: A comprehensive technical overview of the SSL/TLS protocol.
tags: [ssl, tls, tls 1.2, protocol, explanation]
---

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

* the `MD5/SHA-1` combination is the digital signature is replaced with a single hash, which is negotiated during the handshake

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

As you will notice, there are frequent references to the `SSL` protocol in the text,
that is because both are very similar. When I say `SSL`, I'm actually referring to `SSL 3.0`,
even thought the same information migt be true for prior versions of the protocol as well.
I'm not overloading the post with a lot of extra information, the `SSL` part comes in "for free", since most of what is true
for `TLS` is also true for `SLL` (`TLS 1.0` is just `SSL 3.0` with a few extra things, remember?).
If you go searching for more information about the topic, you'll notice that a lot
of times that information refers to `SSL` and not `TLS`. Most probably this information
is still valuable and valid, that's why I think its important for me to underline
the similarities between both of them: that way you're better prepared for "the real world". In fact, some people
use the term `SSL` when in fact they're talking about `TLS`.


## Introduction

`Trasnsport Layer Security (TLS)` is a **client/server** protocol that runs on top of a
**connection-oriented and reliable transport protocol**, such as `TCP`. In the
[TCP/IP protocol stack](https://en.wikipedia.org/wiki/Internet_protocol_suite), the `SSL` and `TLS` protocols
are placed **between the Transport Layer and the Application Layer**, as shown in the image below:

{% include figure.html url="../images/posts/ssl_tls_overview/tls-in-tcp-ip-iluxonchik.png" num="2" term=":" description="SSL/TLS/DTLS Protocol Placement In The TCP/IP Protocol Stack" %}

### Programming Model: Developer Centered

From the beginning, the idea of the protocol was to **make the application developer's life easier**.
To use `SSL/TLS` all the developer has to do is create a **secure connection**, instead
of a "normal" one, in a way that it's as simple as possible. To achieve that goal,
the `SSL/TLS` layer was inserted between the **Transport Layer** and the **Application Layer**.
Its goal is to **establish secure connections** and **transmit data over these secure connections**.

The famous [end-to-end principle](https://en.wikipedia.org/wiki/End-to-end_principle) suggests that security services should be provided
at **higher levels** and this philosophy was adopted in the `SSL/TLS` protocols:
all of the encryption and authentication takes places at the **end-points** (*i.e* the "computers").

## Security Services

`SSL/TLS` provides the following security services:

* **authentication** - both, **peer entity** and **data origin** authentication. Peer's identity is authenticated using **asymmetric**, or **public key**, **cryptography** (for exmaple, `RSA`, `DSA`, etc).
    - **peer entity authentication** - we can be sure that we're talking to certain entity, for example, `www.google.com`.
    - **data origin authentication** - we can be sure that the data that we're receiving is coming from the expected entity (for example, we can be sure that the `index.html` file sent to us when we connected to `www.google.com` in fact came from `www.google.com`) and that it **was not modified** (*i.e* tampered with) en route by an attacker (**data integrity**).

* **confidentiality** - the data transmitted between the communicating entities (the client and the server) is **encrypted**. **Symmetric cryptography** is used of data encryption (for exmaple, `AES`, `RC4`, etc).

* **integrity** - we can be sure that the data was not modified or forged. This
is achieved through the use of a **keyed MAC**. **Secure hash functions** (for example,
`SHA-1`) are used for `MAC` computations.

Even though the `SSL/TLS` protocols use public key cryptography, they **don't provide non-repudiation services**: neither **non-repudiation with proof of origin**, nor **non-repudiation with proof of delivery**.

* **non-repudiation with proof of origin** - addresses the user denying they have sent the message.
* **non-repudiation with proof of delivery** - addressed the user denying they have received the message.

This is due to the fact that instead of using digital signatures, the messages are `MAC`ed instead (to be more precise, the messages are `HMAC`ed).
By definition, a `MAC` requires a **secret** (*i.e.* a key) as an input, which means that both communicating parties **share the same secret key**,
which means that the **non-repudiation** guarantees is dropped, since more than one party knows the secret key (non-repudiation is based on a secret key that is only known to a **single entity**, that's how you can say `"this message was sent by X"`, since `X` is the only entity that knows that secret key).

**You are not required to use all of the 3 services** in every situation. You can think
of `SSL/TLS` as a framework that allows you to select which security services you
want to provide for a communication session. For example, you might ignore certificate
authenticity validation, which means you disable the **authentication** guarantee.
Here is a visual of what I mean, just to give you a mental image:

{% include figure.html url="../images/posts/ssl_tls_overview/ssl-tls-as-a-framework-iluxonchik.png" num="3" term=":" description="Security Services In SSL/TLS Are Optional" %}

As a matter of fact, you can choose not use any of security services, which means
that you're basically "not even using `SSL/TLS`", since everything is transfered
in plaintext (no confidentiality), nothing is authenticated (no authentication) and
the integrity of the messages is not checked (no integrity).

The services used are negotiated during the [Handshake](#todo) phase.

## SSL/TLS Subprotocols

As mentioned before, `SSL/TLS` is an **intermediate layer** between the **Transport Layer**
and the **Application Layer**. It has two main functions:

* establish **secure connections** between the communicating peers (*i.e.* connections that are authentic and confidential).
* use the secure connection to **securely transmit higher-layer protocol data** from one peer to another.
To accomplish this, the `SSL/TLS` layer must **fragment the data to be sent** into manageable pieces.
Those pieces are called **fragments**. Each fragment is then compressed, authenticated with a `MAC`,
encrypted, prepended with a header and transmitted to the recipient. Each one of those
fragments is called a **TLS Record** (or an **SSL Record**, in case of `SSL`). The
recipient, upon receiving a `TLS Record` (or an `SSL Record`) must then decrypt it,
verify its `MAC`, decompress it, reassemble and then **deliver it to a higher-layer protocol** (usually the **Application Layer**).

As an example, this is what happens in case of `HTTPS`, which is basically `HTTP` running over `SSL/TLS` (all of the data sent via `HTTP` is sent via "secure sockets/connections" instead of "normal ones").
First, your browser establishes a secure connection with the server. Then they begin
communicating over that secure connection/channel.Let's consider the case where
you download an `mp3` file from a website (*i.e.* from a server). Fist, the web sever passes the
data to be transfered (in our case the `mp3` file) to the `SSL/TLS layer`.
The `mp3` file might be too big to send all at once, so it might need to be fragmented.
Let's say that our `mp3` file is `10MB` in size and and that the `SSL/TLS layer`
decides to fragment it into `10` pieces, `1MB` each (**NOTE:** realistically, the
fragments would me much smaller in size, I used this size just to keep it simple).
So the web server grabs the first `MB` of the file, compresses it, adds a `MAC` to it,
encrypts it and prepends a header. Congratulations, our fragment just became a
`TLS Record` (or an `SSL Record`)! This means that it's now ready to be sent over the network.
The `SSL/TLS layer` then puts this `SSL/TLS Record` on the network, sending it to your web browser.
Your web browser receives it, decrypts it, verifies its `MAC` and decompresses it.
The web server and the web browser perform the same process for the remaining
`9` fragments. Once all of them have been received and processed by your web browser,
they are now ready to be reassembled into the original `mp3` file that was sent to you
by the web sever.

Below is an image depicting the placement of the `SSL` and `TLS` protocols.
The names are listed for the case of the `SSL` protocol:
you have `SSL Handshake Protocol`, `SSL Change Cipher Spec Protocol`,
`SSL Alert Protocol` and `SSL Record Protocol`. For the case of `TLS` the names
are exactly the same, simply replace `SSL` by `TLS`, so they become: `TLS Handshake Protocol`,
`TLS Change Cipher Spec Protocol`, `TLS Alert Protocol` and `TLS Record Protocol`.
Please note that not all of the discussion below is valid for `TLS 1.3` (for example,
the `Change Cipher Spec Protocol` has been **removed** from `TLS 1.3`), the main idea, however,
remains the same.

{% include figure.html url="../images/posts/ssl_tls_overview/ssl-tls-sub-protocols-iluxonchik.png" num="4" term=":" description="SSL/TLS (sub)layers and (sub)protocols" %}

As you can see, it consists of **2 layers** and **5 sub-protocols**. The **lower layer**
is the `SSL/TLS Record Protocol` and its stacked on top of a reliable,
connection-oriented transfer protocol, such as 'TCP'. The `SSL Record Protocol` is
used to **encapsulate higher-layer protocol data**.

The **higher layer** is stacked on top of the `SSL/TLS Record Protocol` and it
consists of `4` protocols:

* **SSL/TLS Handshake Protocol** - the **core protocol** of `SSL/TLS`. It allows the
communicating peers to **authenticate** one to another and to **negotiate** a **cipher suite** (used to cryptographically protect the data in terms of confidentiality, authenticity and integrity) and a **compression method** (compression is optional and it's used to compress the fragmented data).
* **SSL/TLS Change Cipher Spec Protocol** - used to change or set the initial encryption settings, such as the algorithms used and the keys. The **SSL/TLS Handshake Protocol**
is used to **negotiate** the security parameters, but those parameters only **start being used** after a `ChangeCipherSpec` message. For example, the client and the server
might negotiate that they will be using `AES` to encrypt the data, using a newly negotiated key. Just negotiating doesn't actually "activate" anything, the
data only starts being encrypted with `AES` using that new key after a `ChangeCipherSpec` message. This might happen either in the beginning of the communication or whenever
the communicating peers decide to change the encryption/authentication algorithms and the corresponding keys.
* **SSL/TLS Alert Protocol** - allows the communicating peers to signal potential problems.
* **SSL/TLS Application Data Protocol** - used to **securely transmit data**.
This is the protocol that actually transfers the data that the peers send (for example,
it's the protocol that actually transfers the `mp3` file that you're downloading from the server).
The `3` previous protocols are more of the "boo keeping protocols", they are necessary,
but they don't actually transfer any application data. The `SSL/TLS Application Data Protocol`
takes the data from a higher layer (usually the **Application Layer**) and feeds it into
the `SSL Record Protocol` for **cryptographic protection** and **secure transmission**.

The `SSL/TLS` protocol is **self-delimiting**, meaning that it can determine
the beginning and end of an `SSL/TLS message` inside an `SSL/TLS record`
or `TCP` segment, without any help of `TCP`. For that, as we will see later on,
`length` fields are used: each `SSL/TLS record` has a `length` field, as well
as each **message** carried inside an `SSL/TLS record` also has a `length` field.
An `SSL/TLS Record` **can carry more than one** `SSL/TLS message`.

### SSL/TLS Handshake Protocol Steps

Before we proceed any further, I will give a visual of the exchanged messages during the
`SSL/TLS Handshake Protocol`. Take a look at this image, this will help you
to understand the discussion below, since there are frequent references
to exchanged messages and various `Handshake Protocol Steps`. We will come back to this
image later, so don't stress if you're confused about something.

{% include figure.html url="../images/posts/ssl_tls_overview/ssl-tls-handshake-protocol-iluxonchik.png" num="5" term=":" description="SSL/TLS Handshake Protocol Steps" %}

The messages between square brackets (`[` and `]`) are not always sent.
Also note that even though `ChangeCipherSpec` is represented as a message, it's
actually a protocol of itself, separate from the `Handshake Protocol`
(not true for `TLS 1.3`, since it has been removed from the protocol altogether).
Explanations of all of this are coming later on in this text.

## SSL/TLS Connections and Sessions

It's important to distinguish between an **SSL/TLS session** and an **SSL/TLS connection**:

* **SSL/TLS session** - association between two communicating peers that's
created by the `SSL Handshake Protocol`. The **SSL/TLS session** defines
a set of parameters (cryptographic and others) that are used by **SSL/TLS connections**
**associated with an SSL/TLS Session** to cryptographically protect and compress the
transmitted data. A single `SSL/TLS session` can be **shared among multiple SSL/TLS connections**. An `SSL/TLS session`'s main purpose is to **avoid the expensive negotiation of new parameters for each SSL/TLS connection**.

* **SSL/TLS connection** - used to actually **transmit the data between two communicating peers**. That data is encrypted (although technically, as we've seen before, encryption is actually optional) and compressed (unlike encryption, compression is rarely used). For this to be possible, it's necessary to **establish some parameters**, such as the `secret keys` to encrypt and authenticate the transmitted data.
This "parameter establishment" is done when an **SSL/TLS session** is created,
during the `SSL/TLS Handshake Protocol`. **A single SSL/TLS session might have multiple SSL/TLS connections associated** to it. This relation is depicted in **Figure 6** below.

{% include figure.html url="../images/posts/ssl_tls_overview/ssl-tls-session-to-connection-relation-iluxonchik.png" num="6" term=":" description="SSL/TLS Session and Connection Multiplicity Relation" %}

In the text above I mentioned "cryptographic parameters" and "other parameters".
I don't want to keep you wondering what those "other parameters" might be, so
I'll give you a concrete example of one: the compression method used. The communicating
peers might decide to use no compression (`null` compression method) or `DEFLATE`
compression (Note: [deflate compression method is insecure](https://en.wikipedia.org/wiki/BREACH) and support for compression was removed in [TLS 1.3](https://tools.ietf.org/html/draft-ietf-tls-tls13-21)). You can refer to [RFC 3749](https://tools.ietf.org/html/rfc3749) for a description of TLS compression algorithms.

## Connection States: Current Read/Write State and Pending Read/Write State

`SSL` and `TLS` connections are **stateful**, meaning that both: the client and
the server must keep some **state information**. It's the responsibility of the
`SSL/TLS Handshake Protocol` to establish, coordinate and synchronize
sate on the client and the server side.

Both, the client and the sever, have `4` states in total:

* **pending write state** - pending state (*i.e.* **not** currently in use, but potentially will be, in the future) that contains information
used when sending (*i.e* writing) data to the other peer. This includes information
such as the symmetric encryption algorithm used and the secret key in use with that algorithm,
when sending data to the other peer. This encryption algorithm and key are **not used** to send
data yet, but they potentially might be in the future.

* **current write state** - current state (*i.e.* currently in use) that contains information
used when sending (*i.e* writing) data to the other peer. This includes information
such as the symmetric encryption algorithm used and the secret key in use with that algorithm,
when sending data to the other peer. This encryption algorithm and key are **used** to send
data at this moment.

* **pending read state** - pending state (*i.e.* **not** currently in use, but potentially will be, in the future) that contains information
used when receiving (*i.e* reading) data from the other peer. This includes information
such as the symmetric encryption algorithm used and the secret key in use with that algorithm,
when receiving data from the other peer. This encryption algorithm and key are **not used** to decrypt the received
data yet, but they potentially might be in the future.

* **current read state** - current state (*i.e.* currently in use) that contains information
used when receiving (*i.e* reading) data from the other peer. This includes information
such as the symmetric encryption algorithm used and the secret key in use with that algorithm,
when receiving data from the other peer. This encryption algorithm and key are **used** to decrypt the received
data at this moment.

**All records are processed under the current read and write states**.

### Transition From Pending Read/Write State To Current Read Write State

An entity (*i.e* the client or the server) can transform its `pending write state`
into its `current write state` and its `pending read state` into its `current read state`.
This transitions from `pending write/read states` to `current write/read states` occur
on **sending/receival** of a `ChangeCipherSpec` message, accordingly. The rules are as follows:

* when an entity (*i.e.* the client or the server) **sends** a `ChangeCipherSpec`
message, then it **copies the** `pending write state` **into the** `current write state`.
The `read` states remain unchanged.

* when an entity **receives a** `ChangeCipherSpec` message, then it
**copies the** `pending read state` **into** the `current read state`. The
`write` states ramain unchanged.

Those transitions are pictured below:


{% include figure.html url="../images/posts/ssl_tls_overview/changecipherspec-state-transitions-iluxonchik.png" num="7" term=":" description="ChangeCipherSpec and State Transitions" %}


You've been hearing about that **state** and the **state transitions**, but what
does actually that state holds? A `TLS state` consists of the following elements (their names are as they appear in the [RFC 5246, which describes the TLS 1.2 protocol](https://tools.ietf.org/html/rfc5246)):

**TLS Session State Elements**:

The `Handshake Protocol` is responsible for **negotiating a session** and it consists
of the following elements:

* `session identifier` - arbitrary byte sequence **chosen by the server** to identify an active or a resumable session state (maximum length of `32 bytes`).
* `peer certificate` - `X.509v3` certificate of the other peer (if available, otherwise it's `null`).
* `compression method` - the algorithm used to compress data prior to encryption.
* `cipher spec` - Specifies the Pseudorandom Function (`PRF`) used to generate keying
material, the bulk data encryption algorithm (such as `null`, `AES`, etc.) and the
`MAC` algorithm (such as `HMAC-SHA1`) in use.  It also defines cryptographic attributes
such as the `mac_length`.
* `master secret` - `48-byte` secret shared between the client and server.
* `is resumable` - a flag indicating whether the session can be used to initiate new connections. Many `SSL/TLS` connections can be instantiated using the same session,
through the **resumption feature** of the `SSL/TLS Handshake Protocol`.

The items above are then used to **generate the Security Parameters** (see right below)
to be used by the `Record Layer` when protecting application data.

**TLS Security Parameter Elements**:

* `connection end` - information whether this entity is **considered** the `client`
or the `server` in this connection.
* `PRF algorithm` - algorithm used to generate keys from the `master secret` (more on this later).
* `bulk encryption algorithm`- algorithm to be used for bulk data encryption (*i.e.* the application data exchanged between the communicating peers). This specification
includes the `key size` of this algorithm, whether it is a `block`, `stream`, or `AEAD` cipher, the `block size` of the cipher (if appropriate), and the `lengths` of explicit and implicit initialization vectors (`IV`s or nonces).
* `MAC algorithm` - algorithm used for message authentication. This specification
includes the `size` of `MAC` algorithm's output.
* `compression algorithm` - algorithm used for compression. Includes all of the
information required by the algorithm to do the compression.
* `master secret` - `48-byte` secret shared between the client and server.
* `client random` - A `32-byte` value provided by the client.
* `server random` - A `32-byte` value provided by the server.

Note that the `master secret` is included in both: the **TLS Session State Elements**
and the **TLS Security Parameters**, this is not a typo.
The `Record Layer` will use the security parameters above to generate the following `6`
items (**Note**: some of the parameters below are not required by all of the ciphers,
so they can be empty):

* `client write MAC key` - key used to authenticate data written(sent) by the client (*i.e.* it's the secret key that's the input of the `MAC` function).
* `server write MAC key` - key used to authenticate data written(sent) by the server (*i.e.* it's the secret key that's the input of the `MAC` function).
* `client write encryption key` - the key used to encrypt data written by the client.
* `server write encryption key` - the key used to encrypt data written by the server.
* `client write IV` - `IV` used by the client when writing (sending) data.
* `server write IV` - `IV` used by the client when writing (sending) data.

We will be discussing how these items are generated later in the text. Once the
**Security Parameters** have been set and the `6` keys above generated, the
**connection states can be instantiated by making them the current states**.

**TLS Connection State Elements**:

Each connection state includes the following elements:

* `compression state` - the current state of the compression algorithm.
* `cipher state` - the current state of the encryption algorithm. Consists of the
key for that connection. If a stream cipher is used, this will also contain any necessary state information to allow the stream cipher to encrypt and decrypt the data.
* `MAC key` - the `MAC` key in use for this connection.
* `sequence number` - each `connection state` has a `64-bit` sequence number, which
is maintained **separately for read and write states** (*i.e* there is one `sequence number` for the **received** records and one for the **sent** records). Whenever
a `connection state` is made **active**, this `sequence number` must be set to `0`.
The `sequence number` is **incremented after each record**: the first record
transmitted under a **particular session state** must use the `sequence number` `0`.

#### The Content Of The Read And Write States

Now, okay, that's a lot of info and in the middle of all of this you might still
be a little bit confused what do the `read` and the `write` states contain, so
let's make it clear now.

The `read states contains`:

* the symmetric algorithm used for bulk data encryption
* the `MAC` algorithm used
* the compression algorithm
* the `MAC` key used for received data
* the symmetric key used for received data
* the `IV` used for received data

The `write state contains`:

* the symmetric algorithm used for bulk data encryption
* the `MAC` algorithm used
* the compression algorithm
* the `MAC` key used for sent data
* the symmetric key used for sent data
* the `IV` used for sent data

#### A Few Things To Note

As you have noticed, the data sent from `client` to the `server` is **not** encrypted
with the same key as the data sent from the `server` to the `client`, even though
**the same encryption algorithm** is used by both sides. The same goes for the
`secret key` used in the `MAC` function, as well as the `IV`s.

Even though those values are different, the client and the server must know all of
them, in order to be able to communicate one with another (otherwise how would a client decrypt a message from the server, which uses a different encryption key for sent data).

With those things noted, the following becomes obvious:

* `client write encryption key` == `server read encryption key`
* `server write encryption key` == `client read encryption key`
* `client write MAC key` == `server read MAC key`
* `server write MAC key` == `client read MAC key`
* `client write IV` must be known by the server
* `server write IV` must be known by the client

All of the `6` parameters above must be generated by both: the **client** and the
**server** and the rules above must be satisfied.

In both `SSL` and `TLS` those elements are the same,
the only thing that differs is the terminology.
