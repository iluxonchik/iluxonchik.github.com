---
layout: post
title:  "Why You Should Learn Python"
description: "Why Python is awesome and you should at least give it a try."
tags: [python]
---

# Introduction

My first encounter with Python was a part of the introductory course to programming. Well, I actually played with it on my own before, so I already was familiar with its syntax when the course began, but I didn't do any real project in it before that course. Even though I thought it's a great language to introduce people to programming, I wasn't a big fan of it. It's not that I disliked the language, it was more of a "meh" attitude.
The reason was simple: there was "too much magic". Coming from  a background of languages such as C an Java, which are a lot more explicit in terms of what's going on under the hood, Python was the complete opposite of that. 

Another issue was that Python seemed a lot less structured: writing large, complex programs seemed to be a tougher task to achieve than, for example in Java, where you have some strict rules
when it comes to the structure of the program (for instance the one public class per file rule), Python on the other hand, 
gives you a lot more freedom in such things. 

Another thing is strict typing and debugging: since Python is an interpreted language, finding bugs
wasn't as easy: if you have a syntax error in C, the program will simply not compile, on the other hand, in interpreted languages, the problem might go unnoticed for quite some time, until the execution reaches that particular line of code. Trying to pass a string where an integer is
expected? `cc` will go crazy at you, while Python's interpreter won't mind at all (there are some tool that address that problem though, like 
[mypy](http://mypy-lang.org/), but I'm talking about vanilla Python). What I just mentioned here is a general downside of interpreted languages 
and are not exclusive or particular to Python, but those were some of the main reasons of my initial attitude towards it.

One more thing that I found a little annoying is the **required indentation**. Our teachers (that were great, by the way!) sold that as being a "good thing", since 
"it forced us to a cleaner code writing style". And that is true, but it was a bit annoying, when your code doesn't work as expected, you
analyze the code trying to hunt the bug and can't seem to find it, until after some time you notice that one of the lines in your `if` statement
has an extra space.

I had a discussion with a colleague about Python, telling him how I'm not sure why I wasn't a huge fan of the language before, he asked me with a laughing tone "What's not to like about Python? The fact that it reads almost like English?". The answer to that question is "yes". Since the
language does so many things for you under the hood, sometimes it's not clear what's happening. Let's take as an example file reading. Suppose you
want to read the contents of a file and print them out, line by line.
Here's how you could do it in C:

{% highlight c %}
#include <stdio>

int main(void) {
    FILE *fp;
    char buff[256]; // assuming a line won't contain more than 256 chars
    fp = fopen("hello.txt", "r");

    while(fgets(buff, 256, fp)) {
        printf("%s", buff);
    }

    fclose(fp);
    return 0;
}
{% endhighlight %}

Now the same thing in Python:

{% highlight python %}
with open('hello.txt') as f:
    for line in f:
        print(line)

{% endhighlight %}

Now, many people will consider that as an advantage, however, while in the first case it's pretty clear what's happening:

1. We obtain a file pointer to a file
2. Read the bytes from each line into a buffer, and then print that line from that same buffer
3. Close the stream

In the Python's example none of that is obvious, it just sort of "magically" works. Now, while one might argue that it's a good thing, since it abstracts
the programmer away from the implementation details (and I agree with that), I like to know exactly what's happening.

It's interesting that many of the things that I mentioned as disadvantages, I know consider advantages. To be fair, there is no "magic" in Python,
if you dive in a little deeper, you'll find out that there is no actual magic involved, it's just the way the language interprets your code, and
from that perspective, I find it fascinating. If you share the same feelings, I suggest you to investigate further about how the language works,
if something seems like "magic", find out what's actually happening, things will become a lot clearer and that "magic" will turn into "convenience".

My opinion on those points has changed a lot, specially after I decided to give the language another go, in fact I'm now a big fan of Python!
Now you might be wondering where I'm going to try to convince you that learning Python is a good idea, don't worry that part is coming next.
As a closing point to the introduction, I want to mention that this was my personal feeling towards the language, was just a **personal preference**. I didn't try to convince people that they should learn C, because if you're programming in Python "you're not a real programmer" (in fact,
I don't believe in that). When people asked me which language they should learn as their first, I usually suggested Python, for many of the reasons that I mentioned above as "disadvantages". My feelings were mostly based on my personal interests, I was doing some more low-level stuff at the time, so as you might imagine, Python didn't fit in that picture.

# Python: The Good Parts

After jacking the title for this section from a popular (and great) [JavaScript book](http://shop.oreilly.com/product/9780596517748.do), it's time to begin the topic of this blog post: why you
(yes, you!) should learn Python.

## 1. Universal Scripting Language

This was one of the main reasons why I decided to give Python a second go. I was working on various projects with various people,
naturally different people used different operating systems. In my case, I was usually switching between Windows and Linux. To give a
concrete example, on one of the projects I wrote a script that automated testing in a project, only to realize that I was the 
only one who was taking advantage of it, since it was written in `PowerShell` and I was the only one using Windows. Now there was
natural "bash is so much better" from my colleagues, while I tried to explain them that `PowerShell` followed a completely different paradigm and that it had its strong points (for example, it exposes the `.NET` framework interface),
it's an Object-Oriented scripting language, quite different from `bash`. Now I'm not going to discuss which one is better, since that's not the focus of this post.

So how could this problem solved? Hmmm... now, is there a language that is script-friendly and runs on all major operating systems? You've 
guessed it, that language is `Python`. Besides running on all major operating systems, it also includes functionality useful for scripting out of the box.
The standard library includes a handful of utilities that provide a common interface for operating system dependent functionality.
To provide a simple and straightforward example, let's assume that you wanted to get a list of names of all files in a directory and then do
something with those names. In UNIX, you'd have something like:

{% highlight bash %}
for f in *; do echo "Processing $f file..."; done
{% endhighlight %}

While in PowerShell, you'd go with something similar to:

{% highlight powershell %}
Get-ChildItem "." | 
Foreach-Object {
    $name = $_.Name
    Write-Output "Processing $($name) file..."
}
{% endhighlight %}

An equivalent functionality in Python can be achieved with:

{% highlight python %}
from os import listdir

for f in listdir('.'):
    print('Processing {} file...'.format(f))
{% endhighlight %}

Now, besides running on Linux, MacOSX and Windows, in my opinion, it's also more readable. The example above is a very simple script,
for more complex examples the difference in readability is even more obvious.

As I mentioned earlier, Python comes with great libraries out of the box, for the purpose of replacing shell scripting, the ones that you'll find the most useful are:

* [os](https://docs.python.org/3/library/os.html) - provides OS independent functionality, like working with paths and reading/writing files.
* [subprocess](https://docs.python.org/3/library/subprocess.html) - to spawn new processes and interact with their input/output streams and return codes.
You can use this to launch programs already installed on your system, but note that this might not be the best option if you're worried about the portablity of your script.
* [shutil](https://docs.python.org/3/library/shutil.html) - offers high-level operations on files and collections of files.
* [argparse](https://docs.python.org/3/library/argparse.html) - parsing command-line arguments and building command-line interfaces

Alright, let's say you get the point, cross-platformness (is that even a real word?) and readability sounds great, but you really like the UNIX-like shell syntax.
Good news, you can have the best of the both worlds! Check out [Plumbum](http://plumbum.readthedocs.io/en/latest/), it's a Python module (more on that topic later on),
whose motto is *"Never write shell scripts again"*. What it does is mimics the shell syntax, while keeping it cross-platform.
 
### You Don't Have To Ditch Shell Scripting Altogether

While it's possible to completely substitute shell scripts with Python, you don't have to, since Python scripts naturally fit into the command chaining philosophy of UNIX, all you have 
to do is make them read from `sys.stdin` (standard input) and write to `sys.stdout` (standard output). Let's look at an example. Let's say that you a have file with each line 
containing a word and you want to know which words appear in the file and how many times. This time we don't want to go "all Python", we're actually going to chain the `cat`
command with our Python script, which we'll call `namecount.py`.

Let's say we have a file called `names.txt` with the following content:

    cat
    dog
    mouse
    bird
    cat
    cat
    dog

This is how our script will be used: `$> cat names.txt | namecount.py`. And `PowerShell` folks: `$> Get-Content names.txt | python namecount.py`.

The expected output is something like (order might vary):

    bird    1
    mouse   1
    cat     3
    dog     2

Here is the source of `namecount.py`:

    #!/usr/bin/env python3
    import sys

    def count_names():
        names = {}
        for name in sys.stdin.readlines():
            name = name.strip()

            if name in names:
                names[name] += 1
            else:
                names[name] = 1
                
        for name, count in names.items():
            sys.stdout.write("{0}\t{1}\n".format(name, count))

    if __name__ == "__main__":
        count_names()

Having the information displayed unordered is not the most readable thing, and you'll probably want that ordered by the number of occurrences, so let's do that.
We'll use the piping mechanism again and offload the job of sorting our output to the built-in commands. To sort our list numerically, in descending order
all we have to is `$> cat names.txt | namecount.py | sort -rn`. And if you're using `PowerShell`: `$> Get-Content names.txt | python namecount.py | Sort-Object { [int]$_.split()[-1] } -Descending`
(you can almost hear the UNIX folks complain about how verbose the PowerShell version is).

This time our output is deterministic and we'll get:

    cat     3
    dog     2
    bird    1
    mouse   1

(As a side-note, if you're using `PowerShell`, `cat` is an alias for `Get-Content` and `sort` is an alias for `Sort-Object`, so the commands above can be also written as:
`$> cat names.txt | python namecount.py` and `$> Get-Content names.txt | python namecount.py | sort { [int]$_.split()[-1] } -Descending`)

Hopefully I have convinced you that Python might be a good substitute at least for some of your scripts and that you don't have to ditch shell scripting altogether, since you 
can incorporate Python scripts into your existing workflow and toolbox, with the added benefits of it being cross-platform, more readable and having a rich library collection 
at your disposal (more on that later on).

## 2. A Lot Of Great Libraries

Python has a very rich library collection. I mean, there is a library for [almost anything](https://xkcd.com/353/) (fun fact: if you type `import antigravity` in your Python interpreter, it opens a new browser window which leads you to that xkdc comic, now how awesome is that?). I'm not a big fan of programming just by "stacking one library onto another", but you don't have to. Just because there are a lot of libraries, doesn't mean that you have to use them all. While I don't like to just stack libraries one onto another (which looks more like [CBSE](https://en.wikipedia.org/wiki/Component-based_software_engineering)) I obviously recognize their use and do use them. 

For example, I decided to play around with [Markov Chains](https://en.wikipedia.org/wiki/Markov_chain), so I came up with an idea for a project: grab all of the lyrics from an artist, build a Markov Chain with that and then generate songs from them. The idea is that the generated songs should reflect the artists style. So I hacked around with that project for a bit, and the result was [lyricst](https://github.com/iluxonchik/lyricist) (this is more like a proof of concept than a complete, fully tested project, as I said, I just hacked around for a bit, so don't go to hard on it. It does include a command line-interface and some documentation with examples, if you want to play around). I decided that a great place to get lyrics form would be [RAPGenius](http://rap.genius.com/), since it's actively used and usually up to date).

 So to get all of the artists lyrics, I would have to scrape them from the website and work with HTML. Luckily, Python is great for web scraping and has great libraries like [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) to work with HTML. So this is what I did, used BeautifulSoup to get all of the info from the page I needed (which was basically the song lyrics) and then use that info to build MarkovChains. Of course I could've used regular expressions or built my own HTML parser, but the existence of such libraries allowed me to concentrate on what was the real goal for this project: play around with Markov Chains, while also making it more interesting, then let's say, just reading some text from files.

## 3. Great For Pentesting

If you're into penetration testing or simply like to hack around with stems, Python is your friend! The fact that Python comes pre-installed on almost any Linux and MAC OS machine, has a rich library
collection, very comprehensive syntax and is a scripting language, makes it a great language for that purpose.

Another reason why I decided to give Python a second go (besides the one mentioned in previous section) is that I'm interested in security and Python seemed like
a perfect choice for pentesting. One of my first encounters in that world was [Scapy](http://www.secdev.org/projects/scapy/) (or [Scapy3k](https://github.com/phaethon/scapy), for Python3) and tell you what, I was impressed. Scapy is used for network packet creation, capture and manipulation. It has a straightforward API and great documentation. You can easily create packets on various layers (I'm talking about the [OSI
model](https://en.wikipedia.org/wiki/OSI_model)) or capture them for analysis and modification. You can even export the `.pcap` files and open them in WireShark. It doesn't stop at network packet capture though,
there is a wide array of great libraries for that purpose, but I'm not going to cover them here, since that is not the topic of this post and it deserves a post just for itself.

Some of you might say, "Oh, that's great, but I'm interested in exploiting Windows machines, and those don't come with Python pre-installed". No worries, you can always compile your Python
script to a standalone `.exe`, using [py2exe](http://www.py2exe.org/). The executables can get a little big (depending from the number of libraries you're using in your script), but usually it's nothing major.

If you're intrigued, however, check out this [list of Python pentesting tools](https://github.com/dloss/python-pentest-tools). At the end of this post I also include some book recommendations.

# 4. A Hacker's Language

Python is a very malleable language. You can customize the way it works in many ways. From [altering the way imports work]() to [messing with classes before they are created](). Those are just some of the examples. This also makes it very powerful scripting language (as mentioned in section **1**) and great for pentesting (section **3**), since it gives you a lot of freedom with your scripts.

I won't go deep into those topics, but I will describe the "WOW" moment that I had with this. So, I was doing some webscraping (Python is great for this task!), and one of the tools I used was [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/). This was one of my "learning Python" projects. BeautifulSoup's syntax for working with HTML is very clean and intuitive and one of the reasons for  that is the fact that Python gives you a lot of freedom when it comes to customizing its behavior). After playing a bit with the API, I noticed that there was some "magic". The situation was similar
to this one:

{% highlight python %}
from bs4 import BeautifulSoup

soup = BeautifulSoup('<p class="someclass">Hello</p>', 'html.parser')
soup.p
{% endhighlight %}

What the code above does is creates a BeautifulSoup instance from the string passed as the first argument. The second argument just tells that I want to use the Python's built-in HTML parser (BeautifulSoup
can work with [various parsers](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#specifying-the-parser-to-use)). `soup.p` returns a `Tag` (`bs4.element.Tag`) object, which represents the `<p>` tag
passed as the first argument.

The output of the code above is: 

    <p class="someclass">Hello</p>

Now you might wondering, "where's the magic part you were talking about"? Well, this part comes up next. The thing is that the code above can be adapted to **any tag**, even the custom ones. This means
that the code below works just fine:

{% highlight python %}
from bs4 import BeautifulSoup
 
soup = BeautifulSoup('<foobarfoo class="someclass">Hello</foobarfoo>', 'html.parser')
soup.foobarfoo
{% endhighlight %}

The output is the following:

    <foobarfoo class="someclass">Hello</foobarfoo>

When I realized that that works just fine, I was like "whaaaaa?". Now, the first example can be easily implemented, I mean the most straightforward way is just to define an attribute (instance variable) for every possible HTML tag, and then during parsing assign values different from `None` to them, in case those elements are found. But this explanation does not work for the second example, there is no way that could've been done for all possible string combinations. I wanted to know what was going on and how it was working, so I cracked open BeautifulSoups source code and started digging.
It's probably no surprise that I didn't find any attributes named `p` and the parsing functions didn't assign values to them. After some googling, I found what was going on: **magic methods**. What are 
**magic methods** and why they are called like that? Well, informally, magic methods are methods that give the "magic" to your classes. Those methods are always surrounded by double underscores (for example
`__init__()`). They are described in the [DataModel model section](https://docs.python.org/3/reference/datamodel.html)) in Python docs.

The specific magic method that allows BeautifulSoup to have this functionality 
is `__getattr__(self, name)__` (`self` in Python refers the object instance, 
similar to `this` in Java). If we go to the docs, here's what we'll find in 
the first paragraph:

> Called when an attribute lookup has not found the attribute in the usual
> places (i.e. it is not an instance attribute nor is it found in the class
> tree for self). name is the attribute name. This method should return 
> the (computed) attribute value or raise an AttributeError exception.

So what happens is that if you try to access an attribute that does not exist
`__getattr__(self, name)` of that object will be called, with `name` being
the name of the attribute you tried to access as a string.

Let me show you an example. So let's say you have a `Person` class with a
`first_name` attribute. Let's give the users of our API the ability
to access the same value using `name`. Here's how our class will look like:

{% highlight python %}
class Person(object):
    def __init__(self, first_name):
        self.first_name = first_name

    def __getattr__(self, name):
        if (name == 'name'):
            return self.first_name
        raise AttributeError('Person object has no attribute \'{}\''.format(name))
{% endhighlight %}


Let's play a little with the class above in the interactive console:

    person = Person('Jason')
    >>> person.first_name
    'Jason'

    >>> person.name
    'Jason'

    >>> person.abc
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
      File "<stdin>", line 7, in __getattr__
    AttributeError: Person object has no attribute 'abc'

This means that we can just "make-up" object attributes on the fly, 
isn't that awesome? So you can make your `Dog` secretly be able to
"meow" as well, besides barking:

{% highlight python %} 
class Dog(object):
    def bark(self):
        print('Ruff, ruff!')
    
    def __getattr__(self, name):
        if(name == 'meow'):
           return lambda:  print('Meeeeeeow')
        raise AttributeError('I don\'t know what you\'re talking about...')
{% endhighlight %}

    >>> snoop = Dog()

    >>> snoop.bark()
    Ruff, ruff!

    >>> snoop.meow()
    Meeeeeeow

You can also add attributes on the fly, without [reflection](https://docs.oracle.com/javase/tutorial/reflect/). `object.__dict__` is a 
(dictionary)[https://docs.python.org/3.5/library/stdtypes.html#typesmapping]
containing the the `object`'s attributes and their values (note that I said
`object`.__dict__, `object` is an object instance, there is also a `class`.__dict__, which is a dictionary of the `class`es attributes).

This means that the this:

{% highlight python %}
class Dog(object):
    
    def __init__(self):
        self.name = 'Doggy Dogg'        

{% endhighlight %}

Is equivalent to this:

{% highlight python %}
class Dog(object):
    
    def __init__(self):
        self.__dict__['name'] = 'Doggy Dogg'        

{% endhighlight %}

Both of the versions share the same output:

    snoop = Dog()

    >>> snoop.name
    'Doggy Dogg'

At this point you might be thinking, this is all great, but how is this useful?
The answer is simple: **magical APIs**. Have you ever used some Python library
that just feels like magic? This is one of the things that allows them to be so
"magical". It's not really magic though, once you understand what's happening behind the scenes.

If you're interested more in that topic, check out the [Description Protocol](https://docs.python.org/3.5/howto/descriptor.html) page in the docs.

## The Object-Oriented Aspect

The object-oriented aspect of Python might seem a little "hacked in". For example, there are no private instance variables or methods
in classes. So if you want to make an instance variable or a method private in a class, you'll have to stick to conventions:

* using one leading underscore (`_`) for non-public instance variables and methods
* using two leading underscores (`__`) for instance variables and methods will mangle their name

Let's explore an example, suppose you have the following class:

{% highlight python %}
class Foo(object):
    def __init__(self):
        self.public = 'public'
        self._private = 'public'
        self.__secret = 'secret'
{% endhighlight %}

Let's jump into the interpreter:

    >>> foo = Foo()
    >>> foo.public
    'public'
    >>> foo._private
    'public'
    >>> foo.__secret
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
    AttributeError: 'Foo' object has no attribute '__secret'

As you can see, nothing is stopping you from accessing the `_private` instance variable, but what
happened in the last case? Does that mean variables starting with `__` are really private?
The answer is **no**, their name is just mangled. In essence, instead of being called `__secret`,
its name has been changed to `_Foo__secret` by Mr.Python himself.
You can still access it, if you really want to:

    >>> foo._Foo__secret
    'secret'

However, [PEP8](https://www.python.org/dev/peps/pep-0008/#method-names-and-instance-variables) suggests to only use leading double underscores to avoid name conflicts
with attributes in classes designed to be subclassed. "PEP", stands for "Python Enhancement Proposal",
it's used for describing Python features or processes. If you want a new feature to be added to the
language, you create a PEP, so the whole community can see it and discuss it. You can
[read more about PEPs here](https://www.python.org/dev/peps/pep-0001/). And yes, the description
of what a PEP is a PEP itself, how Meta is that?

As you can see, Python puts a lot of trust in the programmers.

I won't go much further into the OO topic here, since again, that deserves a post (or even a series of them) just for itself.

I do want to give you a heads up that it might get some getting used to, it might not seem as "natural"
as it is in languages like Java, but you know what, it's just a different way of doing things.
As another example, you don't have [abstract classes](https://msdn.microsoft.com/en-us/library/k535acbf.aspx), you have to use decorators to achieve that
behavior.

# Conclusion

Hopefully this post gave you some insight into why you should consider giving Python a go.
This post is coming from someone who feels "guilty" for talking not so good about Python in
the past and is now all over the hype train. In my defense, it was just a "personal preference thing",
when people asked me about which language they should learn first, for instance, I usually suggested
Python.

If you're still undecided, just give it a go! Try it out for an hour or two, read some more stuff
about it. If you like learning from a book, I also got you covered, check out [Fluent Python](http://shop.oreilly.com/product/0636920032519.do)
The section right below has some more.

# Book Recommendations

As promised, here comes the book recommendation section. I will keep this one short, only
putting books that I've read/had experience with myself.

* [Fluent Python](http://shop.oreilly.com/product/0636920032519.do) - **GREAT** book about 
Python 3. Whether you are a novice, intermediate or an experienced Python programmer. Covers the ins
and outs of the language.

* [Web Scraping With Python](http://shop.oreilly.com/product/0636920034391.do) - the title says it all, it's a book about webscraping with Python. You'll explore how you can scrape the web for content,
parse HTML and much more. I would say this book is good for novice and possibly intermediate people in webscraping area. Even if you've never used Python before, you can still follow along. It does not
go into any advanced topics.

* [Black Hat Python](https://www.nostarch.com/blackhatpython) - oh this one's fun! You'll build
reverse SSH shells, trojans and much more! If you want to know how Python can be used in pentesting,
make sure you check this out. Please note that this book contains Python 2 code, [I do have a repo, however, that uses Python 3](https://github.com/iluxonchik/blackhat-python-book).

* [Violent Python: A Cookbook for Hackers, Forensic Analysts, Penetration Testers and Security Engineers](https://www.amazon.com/Violent-Python-Cookbook-Penetration-Engineers/dp/1597499579) - 
more on the same topic as above, you'll learn how to write practical scripts for pentesting,
forensic analysis and security in general.

**EDIT**:

* Thanks to [David Oster](https://disqus.com/by/david_oster/), [Keyaku](https://twitter.com/Keyaku) and [Chris](https://disqus.com/by/disqus_CGYriX8NW3/) for pointing out some typos.
* As per [jyf1987's suggestion](https://twitter.com/jyf1987/status/767906122200080384),
 here is a `namescount.py` version using `collections.defaultdict`: [namescount.py using defaultdict](https://gist.github.com/iluxonchik/348838b3547abf09587d5b4bcbb56f26).
 I'm keeping the original one in the post, because the goal was to be more explicit, so that people new to Python would have less trouble understanding it.