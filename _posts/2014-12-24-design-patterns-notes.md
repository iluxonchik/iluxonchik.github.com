---
layout: post
title:  "Design Patterns Notes"
date:   2014-12-24 22:12:00
categories: design patterns
---
[SingletonUML]: http://zenit.senecac.on.ca/wiki/imgs/Singleton_UML.png "Singleton UML"
[CommandUML]:http://www.dofactory.com/images/diagrams/net/command.gif "Command UML"
[IteratorUML]: http://upload.wikimedia.org/wikipedia/commons/1/13/Iterator_UML_class_diagram.svg "Iterator UML"
[CompositeUML]: http://www.codeproject.com/KB/wiki-aspnet/667251/480px-Composite_UML_class_diagram.svg.png "CompositeUML"
[Button]: http://www.willyoupressthebutton.com/images/mygtukas.png "Button"

**Post Status**: Updating

This isn't really a post per say, it's more of a collection of notes on some
most common design patterns. Maybe some of you will find them useful. All of
the code examples are in Java. This hasn't really been proof-read, so there might
be errors.

## Singleton ##

![Singleton UML Di][SingletonUML]

The **Singleton** Pattern ensures that there is only one instance of the class
and provides a global point to access that instance.

Java's implementation of **Singleton** makes use of a **private constructor**
(to make sure that no one in the application can call the **new Singleton()**,
thus possibly creating more than one instance of the class) and a **static
method**, combined with a **static variable** (to make sure that there is
only one instance of the class in the application, instead of calling
**"new"**, we ask the class itself to provide an instance and since we never
directly instanciate it, the method has to be static). The class itself will
be responsible for keeping track of its sole instance.

Below is an example implementation in Java. This version uses **lazy initialization**
(the instance of the class isn't created until it's first requested via the
**getInstance()** method).

```java
public class Singleton {
  private static Singleton instance = null;
  private Singleton() { }

  public static Singleton getInstance() {
    if (instance == null) {
      instance = new Singleton();
    }
    return instance;
  }
}
```

## Command ##
![Command UML][CommandUML]

The **Command** Pattern encapsulates a request as an object, thereby letting you
parameterize other objects (the client) with different requests, queue or log
requests, and support undoable operations.

  * **encapsulates a request** by binding together a set of actions on a specific
  reciever. To achieve this, the **actions** and the **reciever** are packaged
  into one single object that only exposes one method: **execute()** (it can also
  have other like **undo()**, etc). An object from outside doesn't know what
  actions will be performed, all it knows is that if they call **execute()**
  their request will be serviced.
  * **parameterize other objects** with a command, in a sense that any command
  object can be passed to the client. The client doesn't know (or care) what the
  command is, all it does is call the **execute()** method.
  * the Command Pattern makes it easy to implement **queue, log and undo operations**

  The key in this pattern is an abstract **Command** class (or an interface), which
  declares an interface for executing operations. In its most simple form,
  this inteface has an **execute()** method. A **concrete commad** then has an
  **instance variable of the receiever**, whose methods are called in the **execute()**.
  The command itself doesn't  perform any complex operations, those have to be
  done by the receiever, and that's what happens in the **execute()** method,
  receiver's methods get called.

  ### Example ###
  Let's say you have a remote control that controls the volume and the on/off state
  of your awesome sound system. For simplicity, let's assume that your remote
  control is actually a single button, which you can reprogram to do different actions
  (like voulume up, volume donw, on and off).

  <center>![Button][Button]</center>

  The first thing to do is to create the **Command** interface, which in this
  version, will contain the minimum (i.e. only the **execute()** method).

  Next step will be to create four command classes (TurnOnCommand, TurnOffCommand,
  VolumeUpCommand and VolumeDownCommand). Each of those classes will have a
  reference to the **receiver** (in this case, the sound system), the **execute()**
  method and a constructor.

  Now, just to demonstrate how the Command Pattern will be used, there will also
  be a button, which will have a referece to the command, a method to activate the
  command (**press()**) and a **setCommand()** method, so that different commands
  can be assigned to the same button.

  ```java
  public class SoundSystem {
    private int soundLevel;
    private int state; // 0:off 1:on

    public SoundSystem() {
      soundLevel = 0;
      state = 0;
    }

    public void volumeUp() {
      soundLevel++;
      System.out.println("Sound is at " + soundLevel);
    }

    public void volumeDown() {
      soundLevel--;
      System.out.println("Sound is at " + soundLevel);
    }

    public void turnOn() {
      state = 1;
      System.out.println("ON!");
    }

    public void turnOff() {
      state = 0;
      System.out.println("OFF!");
    }
  }
  ```

  ```java
  public interface Command {
    public void execute();
  }
  ```

  ```java
  public class TurnOnCommand implements Command {
    SoundSystem receiver;

    public TurnOnCommand(SoundSystem soundSystem) {
      receiver = soundSystem;
    }

    public void execute() {
      receiver.turnOn();
    }
  }
  ```

  ```java
  public class TurnOffCommand implements Command {
    SoundSystem receiver;

    public TurnOffCommand(SoundSystem soundSystem) {
      receiver = soundSystem;
    }

    public void execute() {
      receiver.turnOff();
    }
  }
  ```

  ```java
  public class VolumeUpCommand implements Command {
    SoundSystem receiver;

    public VolumeUpCommand(SoundSystem soundSystem) {
      receiver = soundSystem;
    }

    public void execute() {
      receiver.volumeUp();
    }
  }
  ```

  ```java
  public class VolumeDownCommand implements Command {
    SoundSystem receiver;

    public VolumeDownCommand(SoundSystem soundSystem) {
      receiver = soundSystem;
    }

    public void execute() {
      receiver.volumeDown();
    }
  }
  ```

  ```java
  public class Button {
    Command activeCommand;

    public Button() { }

    public void setCommand(Command command) {
      activeCommand = command;
    }

    public void press() {
      activeCommand.execute();
    }
  }
  ```
  And just to show an example of usage, consider the main class below.

  ```java
  public class ButtonTest {
    public static void main(String[] args) {
      SoundSystem soundSystem = new SoundSystem();
      Button button = new Button();

      // Create some commands
      Command turnOnCommand = new TurnOnCommand(soundSystem);
      Command turnOffCommand = new TurnOffCommand(soundSystem);
      Command volumeUpCommand = new VolumeUpCommand(soundSystem);
      Command volumeDownCommand = new VolumeDownCommand(soundSystem);

      // Assign an action to the button
      button.setCommand(turnOnCommand);
      button.press();

      // Change the button's action
      button.setCommand(volumeUpCommand);
      button.press();
      button.press();
      button.press();

      button.setCommand(volumeDownCommand);
      button.press();

      // Turn off after usage to save electric energy!
      button.setCommand(turnOffCommand);
      button.press();
    }
  }
  ```
  Which produces the following output:

  ```
  ON!
  Sound is at 1
  Sound is at 2
  Sound is at 3
  Sound is at 2
  OFF!
  ```
  Note that the command invoker doesn't know what the command is doing or how it's,
  doing it, all it knows is that it has an **execute()** method. Also note that
  the **execute()** is doing very little himself, the main work is done my the
  receiver through some method.

### Implementing the "Undo" Operation ###

In its simplest form, the **undo** operation is pretty straight forward.
For example, what would the **undo** be for the **VolumeUpCommand**? Well,
if that command increases the volume by 1, then the **undo** would decrease it
by one. So the **VolumeUpCommand** would now look something like this:

```java
public class VolumeUpCommand implements Command {
  SoundSystem receiver;

  public VolumeUpCommand(SoundSystem soundSystem) {
    receiver = soundSystem;
  }

  public void execute() {
    receiver.volumeUp();
  }

  public void undo() {
    receiver.volumeDown();
  }
}
```

Besides that, the **undo()** method would also have to be added to the **Command**
interface:

```java
public interface Command {
  public void execute();
  public void undo();
}
```

You could also store all of the commands in a list, for example, and that
would allow you to go through that list, calling **undo()** on every command
object in there (that would be like a history of actions and you can undo multiple
times, just like pressing **Ctrl + Z** on your keyboard multiple times will do more
than one undo).

In a similar manner you could also extend the pattern to other functionality,
such as queing or logging.

## Iterator ##
![Iterator UML][IteratorUML]

The **Iterator** Pattern provides a way to access the elements of an aggregate
object (an object that contains an aggregate of something) sequentially without
exposing its underlying representation.

So let's say you have an object that contains a collection of items and you
want to iterate through every item. But there is a problem here: let's say you
know what items you're accessing, but you don't know how they are stored,
they might be in an **ArrayList**, **HashMap**, **LinkedList**, etc. Now how can
you abstract the internal implementation (i.e. **how** the items are stored) away
and have an interface that allows you to access those elements in a consistent
manner, whichever the internal implementation is. The answer is (you've guessed it!)
the **Iterator** Pattern.

So as mentioned before the **Iterator** Pattern allows you to step through the
elements of an aggregate without knowing how the things are represented under
the hood. It also allows to write **polymorphic code** that works with any of
the aggregates (it doesn't matter if it's an ArrayList, a HashTable or even a
LinkedList, it's an aggregate, that's all we care about).

The Iterator Pattern takes the responsibility of traversing the elements and
gives that responsibility to the **iterator object**, not the **aggregate object**.
This makes all the sense, since the aggregate object doesn't have to know how
to iterate through items, all it has to know is how to store and manage them. It
has to know which objects have been traversed already and which ones haven't.

In its simplest form, the **Iterator** Pattern consists of an Iterator interface,
which contains two methods:
* **next()**, which returns the next object in the aggregation that hasn't been
iterated through yet.
* **hasNext()** which returns a boolean indicating whether there are more items
to be iterated through.

### Example ###
Let's say you asked two of your friends to provide a list of their favorite songs.
Your idea is simple: iterate through both of the lists (lists of songs, no one is
talking about Java **Lists** here) and display the info of each one of the songs
(title and author). You then realized that you didn't specify the format in which
you want the songs to be sent (ArrayList, HashTable, LinkedList, etc) and you need
to be able to iterate over the lists in a consistent way, without depending on
the type of the aggregation.

You'll have to create a concrete iterator for every type of the aggregation,
so let's say one of your friends send the songs in an **HashTable** and the other
in a **LinkedList**.

Below is a possible solution using the **Iterartor** Pattern.

```java
public class Song {
  private String name;
  private String artist;

  public Song(String name, String artist) {
    this.name = name;
    this.artist = artist;
  }

  public String getName() { return name; }
  public String getArtist() { return artist; }
}
```

```java
import java.util.LinkedList;

public class EastCoastMusic {

  LinkedList<Song> eastCoastSongs;

  public EastCoastMusic() {
    eastCoastSongs = new LinkedList<Song>();

    Song s1 = new Song("Nas Is Coming", "NAS");
    Song s2 = new Song("What Up Gangsta", "50 Cent");
    Song s3 = new Song("Warrior","Lloyd Banks");

    eastCoastSongs.add(s1);
    eastCoastSongs.add(s2);
    eastCoastSongs.add(s3);
  }

  public Iterator iterator() {
    return new LinkedListIterator(eastCoastSongs);
  }
}
```

```java
import java.util.Hashtable;

public class WestCoastMusic {

  Hashtable<Integer, Song> westCoastSongs;
  int indexKey;

  public WestCoastMusic() {
    westCoastSongs = new Hashtable<Integer, Song>();
    indexKey = 0;

    Song s1 = new Song("Still Dre", "Dr.Dre");
    Song s2 = new Song("Let's Ride", "The Game");
    Song s3 = new Song("What's My Name?","Snoop Dogg");

    westCoastSongs.put(indexKey++, s1);
    westCoastSongs.put(indexKey++, s2);
    westCoastSongs.put(indexKey++, s3);

  }

  public Iterator iterator() {
    return new HashTableIterator(westCoastSongs);
  }
}
```

```java
public interface Iterator {
  public boolean hasNext();
  public Object next();
}
```

```java
import java.util.LinkedList;

public class LinkedListIterator implements Iterator {

  LinkedList<Song> songs;

  public LinkedListIterator(LinkedList<Song> songs) {

    this.songs = songs;
  }

  public boolean hasNext() {
    return songs.peek() != null;
  }
  public Object next() {
    return songs.pop();
  }
}

```

```java
import java.util.Hashtable;

public class HashTableIterator implements Iterator {

  Hashtable<Integer, Song> songs;
  int indexKey; // songs are indexed by integers

  public HashTableIterator(Hashtable<Integer, Song> songs) {
    this.songs = songs;
    indexKey = 0;
  }

  public Song next() {
    return songs.get(indexKey++);
  }

  public boolean hasNext() {
    return songs.get(indexKey) != null;
  }


}
```

```java
public class Main {
  public static void main(String args[]) {

    WestCoastMusic westCoastMusic = new WestCoastMusic();
    EastCoastMusic eastCoastMusic = new EastCoastMusic();

    // First, iterate through the West Coast Music list
    displaySongs(westCoastMusic.iterator());
    // Now, iterate through the East Coast Music list
    displaySongs(eastCoastMusic.iterator());
  }

  public static void displaySongs(Iterator iterator) {
    Song song;

    while(iterator.hasNext()) {
      song = (Song)iterator.next();
      System.out.println("Name: " + song.getName() +
      " Artist: " + song.getArtist() + "\n");
    }
  }
}
```

The application above produces the following output:
```
Name: Still Dre Artist: Dr.Dre

Name: Let's Ride Artist: The Game

Name: What's My Name? Artist: Snoop Dogg

Name: Nas Is Coming Artist: NAS

Name: What Up Gangsta Artist: 50 Cent

Name: Warrior Artist: Lloyd Banks

```
Note how by using the **Iterator** pattern we decoupled our application
(in this case just the **Main** class) from the underlying implementation
of each aggregation.

All we had to do to our friends code is implement the
**Iterator** interface (which we defined) and add the **iterator()** method
to their classes. If we didn't use the pattern, when iterating through the
list of songs in the **Main** class, we would have to make a separate method
for each aggregation we wanted to traverse.

## Composite ##
![CompositeUML][CompositeUML]
The **Composite** pattern allows you treat objects and compositions of objects
uniformly. It allows you to **compose objects into tree structures** to represent
**part-hole-hierarquies** (components can be divided into smaller and smaller components).

The idea here is really simple: you have an object A that supports some operations,
then you have another object B that is an aggregation of objects of type A.
The **composite** pattern allows you treat both of them using the same interface.
Let's say object A is **a sheep** and supports the **sheer()** operation. So to
sheer a **single sheep** you simply call the **sheer** method on a **sheep object**.
Now, object B is a **group of sheep**. How do you **sheer a group of sheep**?
Simple, **the same way you would sheer an individual sheep**: by calling the
**sheer** method on the object B. Note that the object B can contain sheep
or other objects of the same type(of the type of object B).

So basically, the **composite** pattern allows us to **ignore** the differences
between compositions of objects and individual objects.

### Example ###

In this example, we will use the sheep example introduced above. So the idea is
simple: each sheep has a name and the only operation it supports is sheer().

Now, you sheer a sheep by simply calling the **sheer()** method on it,
but how can you sheer a **group** of sheep? The same way, by calling the
**sheer()** method on it. As mentioned before, the goal is to **inore**
the differences between an individual object and a group of objects, so
we will define an abstract class, which is extended by both: an **individual
sheep** and a **group of sheep** (here, it'll be called **SheepComoponent**).
This approach will also allow SheepComponents to contain other
SheepComponents.

Below is a possible solution to the problem:

```java
public abstract class SheepComponent {

  public void add(SheepComponent sheepComponent) {
    throw new UnsupportedOperationException();
  }

  public void remove(SheepComponent sheepComponent) {
    throw new UnsupportedOperationException();
  }

  public SheepComponent getComponent(int index) {
    throw new UnsupportedOperationException();
  }

  public String getSheepName() {
    throw new UnsupportedOperationException();
  }

  public void sheer() {
    throw new UnsupportedOperationException();
  }
}
```

```java
public class Sheep extends SheepComponent {
  String name;

  public Sheep(String name) {this.name = name; }

  @Override
  public String getSheepName() { return name; }

  @Override
  public void sheer() {
    System.out.println("Sheering " + getSheepName() +
    "...\n");
  }
}

```

```java
import java.util.ArrayList;

public class SheepGroup extends SheepComponent {

  String groupName;
  ArrayList<SheepComponent> sheepComponents;

  public SheepGroup(String name) {
    sheepComponents = new ArrayList<SheepComponent>();
    groupName = name;
  }

  public String getGroupName() {return groupName; }

  @Override
  public void add(SheepComponent sheepComponent) {
    sheepComponents.add(sheepComponent);
  }

  @Override
  public void remove(SheepComponent sheepComponent) {
    sheepComponents.remove(sheepComponent);
  }

  @Override
  public SheepComponent getComponent(int index) {
    return sheepComponents.get(index);
  }

  @Override
  public void sheer() {
    Sheep sheep;
    int numOfSheep = sheepComponents.size();
    System.out.println("Group Name: " + groupName +
    "\n" + "---" + "\n");

    // NOTE: The Iterator pattern is more suitable here
    for (int i = 0; i < numOfSheep; i++) {
      sheepComponents.get(i).sheer();
    }

  }
}
```

```java
public class Main {

  public static void main(String agrs[]) {
    SheepGroup sg1 = new SheepGroup("Sheep Group 1");

    Sheep s1 = new Sheep("Sheep 1");
    Sheep s2 = new Sheep("Sheep 2");
    Sheep s3 = new Sheep("Sheep 3");
    Sheep s4 = new Sheep("Sheep 4");
    Sheep s5 = new Sheep("Sheep 5");

    sg1.add(s2);
    sg1.add(s3);
    sg1.add(s4);
    sg1.add(s5);

    s1.sheer();
    sg1.sheer();

    SheepGroup sg2 = new SheepGroup("SheepGroup 2");
    sg2.add(s1);
    // Now, compose a group of sheep with another group of sheep
    sg2.add(sg1);
    Sheep s6 = new Sheep("Sheep 6");
    sg2.add(s6);
    sg2.sheer();
  }
}
```

The output of the application above is:

 ```
 Sheering Sheep 1...

 Group Name: Sheep Group 1
 ---

 Sheering Sheep 2...

 Sheering Sheep 3...

 Sheering Sheep 4...

 Sheering Sheep 5...

 Group Name: SheepGroup 2
 ---

 Sheering Sheep 1...

 Group Name: Sheep Group 1
 ---

 Sheering Sheep 2...

 Sheering Sheep 3...

 Sheering Sheep 4...

 Sheering Sheep 5...

 Sheering Sheep 6...

 ```
