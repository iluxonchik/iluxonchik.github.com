---
layout: post
title:  "Design Patterns Notes"
date:   2014-12-24 22:12:00
categories: design patterns
---
[SingletonUML]: http://zenit.senecac.on.ca/wiki/imgs/Singleton_UML.png "Singleton UML"
[CommandUML]:http://www.dofactory.com/images/diagrams/net/command.gif "Command UML"
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
        times, just like pressing Ctrl + Z on your keyboard multiple times will do more
        than one undo).

      In a similiar manner you could also extend the pattern to other functionality,
      such as queing or logging.
