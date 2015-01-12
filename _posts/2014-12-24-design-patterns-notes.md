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
[VisitorUML]:http://www.lepus.org.uk/spec/gof/uml/Visitor.png "VisitorUML"
[FactoryMethodUML]: http://www.apwebco.com/images/FactoryMethod.jpg "FactoryMethodUML"
[StrategyUML]: https://www.clear.rice.edu/comp212/99-fall/handouts/week4/design2.gif "StrategyUML"
[StateUML]: http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/State_Design_Pattern_UML_Class_Diagram.svg/400px-State_Design_Pattern_UML_Class_Diagram.svg.png "StateUML"
[AbstractFactoryUML]: http://i.imgur.com/zOjmV6V.png "AbstractFactoryUML"
[Button]: http://www.willyoupressthebutton.com/images/mygtukas.png "Button"


[FiniteStateMachineWiki]: http://en.wikipedia.org/wiki/Finite-state_machine "FiniteStateMachineWikipedia"

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

## Visitor ##

![VisitorUML][VisitorUML]

The **Visitor** pattern allows you to add new methods to the classes without
changing them too much. You can add operations to a **Composite** structure
without changing the structure itself.

Visitor is very useful when you have some unrelated operations that need to
be performed on an object in an object structure and you don't want to
"pollute" their classes by adding new methods to them to perform those operations.
This pattern allows you to keep related operations together defined in a
**separate class**. This is very useful when your object structure is shared
by many applications, but only some of those applications actually use those
extra operations, since visitor allows you to put those operations only in the
applications that need them.

So let's say you have the class code written and now you're wondering what
changes you'll have to make to the class for it to support the **visitor** pattern.
Okay, make sure you have a piece of paper and pen to write them down. Not really,
actually all you have to do is **add an accept() method to your class** (it's a
convention to call the method accept(), you can name it whatever you want).
Yes, that's it! All you have to do for your classes to support the **visitor**
pattern is **add a single method**. That's what we're basically going to do,
except we're going to put this method in an **Interface**, we'll call it
**"Visistable"** (this name makes sense, since the class **will be visted** by
a visitor).

Okay, now how do we create those "visitors"? Simple, first we create another
interface called **Visitor** (again, this name is just a convention).
And what will that interface contain? It will contain **the new operations we
want to add**. Now, since we're putting them in an interface, those operations
have to be related (i.e. be somehow related, belong to the same "group").

Now you might be wondering what will you do if you had more than just one
group of operations? Well, in that case you would have to add another **accept()**
method to your **Visitable** interface (use method overloading).

### Example ###

Let's say you have a store and your store sells three products: drinks, food and
gadgets. Each of those three objects has a price. Here is how your code looks now:

```java
public class Drink {
  double price;

  public Drink(double price) { this.price = price; }
  public double getPrice() { return price; }
}
```

```java
public class Gadget {
  double price;

  public Gadget(double price) { this.price = price; }
  public double getPrice() { return price; }
}
```

```java
public class Food {
  double price;

  public Food(double price) { this.price = price; }
  public double getPrice() { return price; }
}
```

(Okay, a better choice would be to add an abstract class from which those methods
derive, but I want to enforce the idea that **the classes don't have to be related
in any way**).

Now you are asked to be able to calculate taxes for each product(the tax is 21%).
That's where the visitor comes in. First you'll create a **Visitor** interface
and add three **visit()** methods there. Then you'll create a new class: **a
concrete visitor**, which implements the **Visitor** interface. Then, we'll create
a **Visitable** interface and add the **accept()** method to it, which takes
an object of type **Visitor** as an argument. The **Food**, **Drink** and **Gadgets**
classes will implement the **Visitable** interface. Now your code will look
something like this:

```java
public interface Visitable {
  public double accept(Visitor visitor);
}
```

```java
public interface Visitor {
  public double visit(Drink drink);
  public double visit(Food food);
  public double visit(Gadget gadget);
}
```

```java
public class NormalTaxVisitor implements Visitor {
  final double TAX_VALUE  = 0.21;

  public double visit(Drink drink) {
    return drink.getPrice() * TAX_VALUE + drink.getPrice();
  }

  public double visit(Food food){
    return food.getPrice() * TAX_VALUE + food.getPrice();
  }
  public double visit(Gadget gadget) {
    return gadget.getPrice() * TAX_VALUE + gadget.getPrice();
  }
}
```

```java
public class Drink implements Visitable {

  double price;

  public Drink(double price) { this.price = price; }
  public double getPrice() { return price; }

  public double accept(Visitor visitor) { return visitor.visit(this); }
}
```

```java
public class Food implements Visitable {

  double price;

  public Food(double price) { this.price = price; }
  public double getPrice() { return price; }

  public double accept(Visitor visitor) { return visitor.visit(this); }

}
```

```java
public class Gadget implements Visitable {

  double price;

  public Gadget(double price) { this.price = price; }
  public double getPrice() { return price; }

  public double accept(Visitor visitor) { return visitor.visit(this); }

}
```
Now you are asked to add yet another type of tax: a holiday tax. It's basically
the same as the previous one, except the tax value is now 18% and you always
subtract two cents (0.02) from the value after tax (here we'll ignore that you
can get negative or zero values). Well, that's simple, just create a new class
**HolidayTaxVisitor**, implement the **Visitor** interface and add override the
methods with the requested functionality. Your new class will look something like
this:

```java
public class HolidayTaxVisitor implements Visitor {
  final double TAX_VALUE  = 0.18;
  final double DISCOUNT  = 0.02;

  public double visit(Drink drink) {
    return drink.getPrice() * TAX_VALUE + drink.getPrice() - DISCOUNT;
  }

  public double visit(Food food){
    return food.getPrice() * TAX_VALUE + food.getPrice() - DISCOUNT;
  }
  public double visit(Gadget gadget) {
    return gadget.getPrice() * TAX_VALUE + gadget.getPrice() - DISCOUNT;
  }
}
```

And now an example application:

```java
public class Main {
  public static void main(String[] args) {
    Drink d = new Drink(1.50);
    Food f = new Food(2.75);
    Gadget g = new Gadget(7.25);

    NormalTaxVisitor ntv = new NormalTaxVisitor();
    HolidayTaxVisitor htv = new HolidayTaxVisitor();

    System.out.println("Drink price after normal tax: " +
    d.accept(ntv) + "\n");

    System.out.println("Drink price after holiday tax: " +
    d.accept(htv) + "\n");

    System.out.println("Food price after normal tax: " +
    f.accept(ntv) + "\n");

    System.out.println("Food price after holiday tax: " +
    f.accept(htv) + "\n");

    System.out.println("Gadget price after normal tax: " +
    g.accept(ntv) + "\n");

    System.out.println("Gadget price after holiday tax: " +
    g.accept(htv) + "\n");
  }
}
```

The output of the Main class above is the following:

```
Drink price after normal tax: 1.815

Drink price after holiday tax: 1.75

Food price after normal tax: 3.3275

Food price after holiday tax: 3.225

Gadget price after normal tax: 8.7725

Gadget price after holiday tax: 8.535

```

Now what if you wanted a different group of operations, not related in any
way to tax calculation? Let's say you wanted to be able to print out the name of
the class of which an object is instance of. Well, in that case you'd have to
create a new visitor interface, for example **NameVisitor**, create a concrete
instance, which implements that interface, for example **NormalNameVisitor**
and add a new **accept()** method to the **Visitable** interface.

```java
public interface NameVisitor {
  public String visit(Drink drink);
  public String visit(Food food);
  public String visit(Gadget gadget);
}
```

```java
public class NormalNameVisitor implements NameVisitor {
  public String visit(Drink drink) { return "Drink"; }
  public String visit(Food food) { return "Food"; }
  public String visit(Gadget gadget) { return "Gadget"; }
}

```

```java
public interface Visitable {
  public double accept(Visitor visitor);
  public String accept(NameVisitor visitor);
}
```

## Factory Method ##

![FactoryMethodUML][FactoryMethodUML]

The idea behind the **Factory Method** pattern is to be able to decide which
class you want to instantiate **dynamically** (i.e. at **runtime**). Basically
you will have a method that will return one of several possible classes that
**share a common superclass**. The **factory method** has this name, because
it's responsible for "manufacturing" an object. This pattern allows you
to encapsulate object creation in a method: the **factory method**.

The typical implementation uses a single class with a single method (the
**factory method**) and this method returns an object based on the input passed
as an argument. Which object is it? Well, that depends on the passed parameter.

### Example ###

Let's say that you have a **Fruit** superclass that has two subclasses:
**Apple** and **Orange**. You want your application to be able to instantiate
each one of the subclasses dynamically, because you don't know which fruit you'll
need (it might depend on the user input, for example).

All you'll have to do is create a **FruitFactory** class and add a **makeFruit()**
method to it, which accepts, for example a string and returns a **Fruit** (note
it returns the generic **Fruit** object, not a concrete **Apple** or **Orange**).

To simplify things, let's say that to create an apple you pass the "Apple" string
as an argument and to create an orange you use the "Orange" string.

Below is a possible solution:

```java
public abstract class Fruit {
  final String type;

  public Fruit(String type) { this.type = type; }

  public String getType() { return type; }
}
```

```java
public class Apple extends Fruit {
  public Apple() { super("Apple"); }
}
```

```java
public class Orange extends Fruit {
  public Orange() { super("Orange"); }
}
```

```java
public class FruitFactory {
  public Fruit makeFruit(String type) {
    Fruit fruit = null;

    if (type == "Apple")
    fruit = new Apple();

    else if(type == "Orange")
    fruit = new Orange();

    return fruit;
  }
}
```

```java
public class Main {
  public static void main(String[] args) {
    Fruit fruit;
    FruitFactory fruitFactory = new FruitFactory();

    fruit = fruitFactory.makeFruit("Apple");
    System.out.println("The fruit is an " + fruit.getType() + ".");

    fruit = fruitFactory.makeFruit("Orange");
    System.out.println("The fruit is an " + fruit.getType() + ".");
  }
}
```

The Main class above produces the following output:

```
The fruit is an Apple.
The fruit is an Orange.
```
## Strategy ##

![StrategyUML][StrategyUML]

The **Strategy** pattern lets you define a family of algorithms, encapsulates
each one, and makes them interchangable. It lets the algorithms vary independently
from clients that use it.

This pattern is very useful in cases when you have many **hierarchically related**
classes that differ only in their behaviour. Strategy allows you to confugure
every induvidual class in the hierarchy with **one of the many behaviours**.
Another use case for it is when you have many variants of an algorithm.

### Example ###

Let's say you have the class structure below:

```java
public abstract class Animal {
  String name;
  String sound;

  public Animal(String name, String sound) {
    this.name = name;
    this.sound = sound;
  }

  public void makeSound() {System.out.println(name + " says: " + sound + ".\n");}
}
```

```java
public class Dog extends Animal {
  public Dog(String name) { super(name, "Ruff Ruff"); }
}
```

```java
public class Cat extends Animal {
  public Cat(String name) { super(name, "Meow"); }
}
```

Now you are asked to create a **Bird** class, which is also a subclass of the
Animal class. The thing about the Bird class, is that it needs to be able to fly.
You must also keep a common interface for all of the three subclasses, that means
you can't just add a **fly()** method to the Bird class, from now on every animal
must print "Can't fly!" or "Flying!" when the **fly()** method is invoked on
an **Animal** object.

So how can we solve this? Well, we surely can just add a "fly()" method to
the abstract class (or implement an interface) and override its behaviour in every
subclass. But this creates several problems:

* code duplication.
* the change in super class will **break** the code in subclasses.
* implementing an inteface wich only has one method in it is usually a bad approach.

So what can we do to avoid those problems? Well, since all of our classes only
differ in one behaviour (some fly and some don't) it's the right time to use
the **Strategy** pattern!

What we'll do instead is instead of **inheriting** the ability to fly, we will
compose the class with objects which have the correct ability built-in (in out
case we will only add one object).

This approach will give us many benefits, for example:

* it's possible to create many types of "flying" without affecting the **Animal**
class or any of its subclasses (since the "types of flying" are separate classes).
* we are **decoupling**, that means we are **encapsulating the behavior that
varies**(in our case the behaviour is the ability to fly).
* it's possible to change the ability at **runtime**. That means we can, for example,
create an object that couldn't fly before and make it flyable!

What we'll do is create an interface called **Fly**, it will only have one method:
**fly()** (which is the behaviour we want to encapsulate) and then for every
"type of flying" we will create a subclass, each one implementing the **Fly**
interface (in our case it will be two classes: **CanFly** and **CantFly**).
We'll also have to add a new varibale to the **Animal** class of type **Fly**.

Anyways, here is a possible soluition using the **Strategy** pattern, with
an example of a client application that uses it:

```java
public interface Fly {
  public String fly();
}
```

```java
public class CanFly implements Fly {
  public String fly() { return "Flying!";}
}
```

```java
public class CantFly implements Fly {
  public String fly() { return "Can't fly!"; }
}
```

```java
public abstract class Animal implements Fly {
  String name;
  String sound;

  Fly flyBehaviour; // new variable!

  public Animal(String name, String sound) {
    this.name = name;
    this.sound = sound;
  }

  public void makeSound() {System.out.println(name + " says: " + sound + ".\n");}

  /* New methods below */
  public String fly() { return name + ": " + flyBehaviour.fly() + "\n"; }

  // allow to change the flying ability dynamically
  public void setFlyingBehaviour(Fly flyBehaviour) {
    this.flyBehaviour = flyBehaviour;
  }
}
```

```java
public class Dog extends Animal {
  public Dog(String name) {
    super(name, "Ruff Ruff");
    flyBehaviour = new CantFly();
  }
}
```

```java
public class Cat extends Animal {
  public Cat(String name) {
    super(name, "Meow");
    flyBehaviour =  new CantFly();
  }
}
```

```java
public class Bird extends Animal {
  public Bird(String name) {
    super(name, "Tweet");
    flyBehaviour =  new CanFly();
  }
}
```

```java
public class Main {
  public static void main(String[] args) {
    Animal cat = new Cat("Mittens");
    Animal dog = new Dog("Rufus");
    Animal bird = new Bird("Tweetie");

    System.out.println(cat.fly());
    System.out.println(dog.fly());
    System.out.println(bird.fly());

    // Rufus can fly now!
    dog.setFlyingBehaviour(new CanFly());
    System.out.println(dog.fly());
  }
}
```

The main class produces the following output:

```
Mittens: Can't fly!

Rufus: Can't fly!

Tweetie: Flying!

Rufus: Flying!
```

## State ##

![StateUML][StateUML]

The **State** pattern allows to modify its behavior when its internal state
changes. The object will also appear to change its class. It actually mimics
the [finite state machine][FiniteStateMachineWiki]: you have different states
and certain actions make you transition from one state to another.

This pattern encapsulates every state into a separate class (all those states
derive from a common class). If you have an object and you completely change
its behavior, it appears that the object changed it class (in reality you will
just be using composition to give the appearance of class change by referencing
different state objects).

The **State** pattern is a great way to get rid of if statements, but
it usually requires a large amount of extra classes to be created.

Each state has a reference to the object whose state it represents and is able
to change it dynamically (usually through a setter method).

## Example ##

Too keep it simple, consider the following problem:
You have an automatic door with two buttons: **open** and **close**.
You have four states:

* open
* closed


The transitions between the states are intuitive: for example, if a door is
closed, by pressing the **open** button, the door will go to the "open" state.
To simplify, you can't interrupt an opening/closing action(there are no
intermediate **DoorOpeningState** and **DoorClosingState** classes).

What you'll do is create an abstract **DoorState** class, with two operations:

* openDoor()
* closeDoor()

Then, you will create two subclasses: **DoorOpenState**, **DoorClosedState**.
Each one of the states will have a reference to the **Door** object (passed as
an argument in the constructor) whose state it represents and it will be able
to change its state through the **setStateMethod()** which will be a part of the
Doors interface.

In this example, the **Door** class will contain references to every possible
state which will be instantiated when a new **Door** object is created.

Below is a possible solution to the problem.

```java
public abstract class DoorState {
  Door door;
  public abstract void open();
  public abstract void close();

  public DoorState(Door door) { this.door = door; }
}
```

```java
public class DoorOpenState extends DoorState {
  public DoorOpenState(Door door) { super(door); }

  public void open() { System.out.println("Door is already open!\n"); }  
  public void close() {
    System.out.println("Closing door... New state: DoorClosedState.\n");
    door.setState(door.DOOR_CLOSED_STATE);
  }
}
```

```java
public class DoorClosedState extends DoorState {
  public DoorClosedState(Door door) { super(door); }


  public void open() {
    System.out.println("Opening door... New state: DoorOpen.\n");
    door.setState(door.DOOR_OPEN_STATE);
  }
  public void close() { System.out.println("Door is already closed!\n"); }  
}
```

```java
public class Door {
  public final DoorState DOOR_OPEN_STATE = new DoorOpenState(this);
  public final DoorState DOOR_CLOSED_STATE =  new DoorClosedState(this);


  DoorState state;

  public Door() {
    // initially, the door is closed
    setState(DOOR_CLOSED_STATE);
  }

  public void open() { state.open(); }
  public void close() { state.close(); }

  public void setState(DoorState newState) { state = newState; }
}
```


```java
public class Main {

  public static void main(String[] args) {
    Door door = new Door();

    door.open();
    door.close();
    door.close();
  }
}
```

The output of the application above is:

```
Opening door... New state: DoorOpen.

Closing door... New state: DoorClosedState.

Door is already closed!
```

## Abstract Factory ##

![AbstractFactoryUML][AbstractFactoryUML]

The **Abstract Factory** pattern provides an interface for creating families of
related or depended objects without specifying their concrete classes.

The idea if an abstract factory is to define a common interface for a group of
factories, then use those factories to produce objects. It provides an abstract
type for creating a family of products and **subclasses** of that abstract type
define how those products are produced. To use a specific factory, you'll have
to instantiate it and pass into some code that is written against the **abstract
type**.

#### Factory Method vs Abstract Factory ####

It's important to understand the difference between the **Abstract Factory** and
the **Factory Method** patterns. While both are really good at **decoupling
applications from specific implementations**, they do it in different ways.
Both of the patterns **create objects**, but they do it in a different way:

* **Factory Method** uses **classes** - the objects are created through
**inheritance**.
* **Abstract Factory** uses **objects** - the objects are created through
**object composition**.

Often the **Abstract Factory** uses **Factory Methods** to implement its concrete
factories. The concrete factories use a factory method to create their products
(they are used purely to create products).

### Example ###

Consider the example from the **Factory Method** section. Well, here we also have
fruit, except that one of the farmers has discovered a new sort of fruit:
the **Advanced Fruit**. What distinguishes a "normal" **Fruit** from an
**AdvancedFruit**? Well, unlike the "normal" **Fruit**, all **AdvancedFruit** have
guns and engines!

The farmer in question is only producing **AdvancedApple** and **AdvancedOrange**
types of **AdvancedFruit**, so those are the ones that will be covered in this
example.

What distinguished an **AdvancedApple** from an **AdvancedOrange**? Well,
while **AdvancedApple** has a **BlueGun** and a **V16Engine**, the
**AdvancedOrange** has a **RedGun** and a **V8Engine**.

Hmmm... Isn't that a good place to use the **Abstact Factory** pattern to
abstract out the specific gun and engine creation? Note, that both, advanced apples
and oranges have guns and engines, except that they are of different types.
We sure can come up with a common abstract interface to produce those pieces of
equipment and then have two specific implementations of those: one for the
advanced apples and one for the advanced oranges.

When defining an abstract interface for out factories we have to question
**what makes an AdvancedFruit an AdvancedFruit?** Well, it's the fact
that every **AdvancedFruit** has an **Engine** and a **Gun**.

Out abstract interface only will have to methods: **makeEngine()** and **makeGun()**
(we'll call it the **AdvancedFruitFactory**). Then in **AdvancedAppleFactory** and
**AdvancedOrangeFactory** we'll make those methods return the correct **Engine** and
**Gun** objects.

Now every advanced fruit will receive a concrete factory in its constructor,
because it's through a method call on the **AdvancedFuit** object, that
the specific engine and gun will be "given" to it.

Below is a possible solution to the problem:

```java
public abstract class Fruit {
  final String type;

  public Fruit(String type) { this.type = type; }

  public String getType() { return type; }
}
```

```java
public abstract class AdvancedFruit extends Fruit {
  Engine engine;
  Gun gun;

  public AdvancedFruit(String name) { super(name); }

  public void printInfo() { System.out.println("Name: " + type +
  " Gun: " + gun.toString() + " Engine: " + engine.toString() + "\n"); }

  public abstract void makeFruit();
}
```

```java
public class AdvancedApple extends AdvancedFruit {
  AdvancedFruitFactory aff;

  public AdvancedApple(String type, AdvancedFruitFactory aff) {
    super(type);
    this.aff = aff;
  }

  public AdvancedApple(AdvancedFruitFactory aff) { this("Generic AdvancedApple", aff); }

  public void makeFruit() {
    engine = aff.makeEngine();
    gun = aff.maneGun();
  }
}
```

```java
public class AdvancedOrange extends AdvancedFruit {
  AdvancedFruitFactory aff;

  public AdvancedOrange(String type, AdvancedFruitFactory aff) {
    super(type);
    this.aff = aff;
  }

  public AdvancedOrange(AdvancedFruitFactory aff) { this("Generic AdvancedOrange", aff); }

  public void makeFruit() {
    engine = aff.makeEngine();
    gun = aff.maneGun();
  }
}
```

```java
public abstract class AdvancedFruitBuilding {

  // Hey, that's the Factory Method! Except now it "protected" and not "public"
  protected abstract AdvancedFruit makeAdvancedFruit(String typeOfFruit);

  public AdvancedFruit orderAdvancedFruit(String typeOfFruit) {
    // First, create the requested AdvcancedFruit
    AdvancedFruit af = makeAdvancedFruit(typeOfFruit);

    // Now, complete each AdvancedFruit with its specific properties
    af.makeFruit();

    return af;
  }
}
```

```java
public class NaturalAdvancedFruitBuilding extends AdvancedFruitBuilding {
  /* A Specific Builder */

  // Hey! It's a factory method! It's used to create concrete products
  protected AdvancedFruit makeAdvancedFruit(String typeOfFruit) {
    AdvancedFruit af = null;

    if (typeOfFruit == "Apple") {
      // For Advanced Apples, we will use the AdvancedAppleFactory
      AdvancedFruitFactory aff = new AdvancedAppleFactory();
      af = new AdvancedApple(aff);
    }
    else if (typeOfFruit == "Orange") {
      // For Advanced Oranges, we will use the AdvancedOrangeFactory
      AdvancedFruitFactory aff = new AdvancedOrangeFactory();
      af = new AdvancedOrange(aff);
    }

    return af;
  }
}
```

```java
public interface AdvancedFruitFactory {
  /* The abstract factory interface */
  public Engine makeEngine();
  public Gun maneGun();
}
```

```java
public class AdvancedAppleFactory implements AdvancedFruitFactory {
  /* A specific factory that produces engines and guns for adv. apples */
  public Engine makeEngine() { return new V16Engine(); }
  public Gun maneGun() { return new BlueGun(); }
}
```

```java
public class AdvancedOrangeFactory implements AdvancedFruitFactory {
  /* A specific factory that produces engines and guns for adv. oranges */
  public Engine makeEngine() { return new V8Engine(); }
  public Gun maneGun() { return new RedGun(); }
}
```

```java
public interface Engine {

  public String toString();
}
```

```java
public interface Gun {

  public String toString();
}
```

```java
public class V16Engine implements Engine {

  public String toString() { return "V16 Engine"; }
}
```

```java
public class V8Engine implements Engine {

  public String toString() { return "V8 Engine"; }
}

```

```java
public class BlueGun implements Gun {

  public String toString() { return "Blue Gun"; }
}
```

```java
public class RedGun implements Gun {
  public String toString() { return "Red Gun"; }
}
```

```java
public class Main {
  public static void main(String[] args) {
    AdvancedFruitBuilding afb = new NaturalAdvancedFruitBuilding();
    AdvancedFruit apple = afb.orderAdvancedFruit("Apple");
    AdvancedFruit orange = afb.orderAdvancedFruit("Orange");

    apple.printInfo();

    orange.printInfo();
  }
}
```

The output of the **Main** class is as follows:

```
Name: Generic AdvancedApple Gun: Blue Gun Engine: V16 Engine

Name: Generic AdvancedOrange Gun: Red Gun Engine: V8 Engine
```
