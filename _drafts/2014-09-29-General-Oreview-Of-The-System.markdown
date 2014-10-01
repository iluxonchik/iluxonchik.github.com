---
layout: post
title:  "General Oreview Of The System"
date:   2013-07-04 10:18:00
categories: Linux, UNIX, Operating System
---

#System Structure#
<p align="center">
  <img src="./UNIXarch.png" alt="Sublime's custom image"/>
</p>
<p align="center">
<b> Figure 1. Architecture Of UNIX Systems</b>
</p>
The figure above shows the high-level architecture of the UNIX system. The hardware provides the operating system with basic services and the operating system interacts directly with it. Viewing the system as set of layers, it's usually called **system kernel** or simply **kernel**, emphasizing its isolation from the user programs. Since the programs are independent of the underlying hardware, it's easy to move them between various UNIX systems running on different hardware. 

As the figure suggests, the user applications are at the highest level and do not interact directly with the hardware, instead they communicate with intermediate layers, which might interact with other layers as well, until the interaction eventually reaches the **kernel**, which performs the task of interacting with hardware directly. The **kernel** provides services upon wich all of the UNIX applications rely.

Programs such as the shell (like bash) and text editors(like ed and vi) interact with the kernel by invoking a well defined set of **system calls**. A **system call** is the way the program requests a service from the kernel (for example, the program might request some data from the disk, so it forwards this request to kernel). System calls instruct the kernell to perform various operations for the calling program, as well as exchange data between the kernel and the program.

#User Perspective#

##The File Sytsem##
The UNIX file system is characterized by

* a hierarchical structure
* cosistent treatment of file data
* the ability to create and delete files
* dynamic growth of files
* the protection of file data
* the treatment of peripheral devices (such as terminals and USB drives) as files.

In UNIX, the file system is organized in a tree structure with only one root node, which is called (surprise, surprise!) **root** (written "/"). Every non-leaf in the tree is a directory (A.K.A. a folder), which contains other files inside. The file name is given by it's path, specifying how to locate that file in the file system hierarchy. As mentioned before, the UNIX OS treats devies as if they were files(i.e. you acess a peripheral device, just as you would a directory stored on your local hard drive). Below is a picture of a simple file system tree (**Figure 2.**).
<p align="center">
  <img src="./FSTree.png" alt="Sublime's custom image"/>
</p>
<p align="center">
<b> Figure 2. Sample File System Tree</b>
</p>

An important note is that programs in UNIX **don't have any knowledge** about the internal format in which the kernel stores the data, they all treat that data as an **unformated stream of bytes**. Programs, on the other side, are free to interpert the data they way they want, however the file's format doesn't affect the way the OS stres the data. 

The files can have different permissions. It's possible to define for every individual file the **read, write** and **execute** permissions for the three classes of users: the file **owner**, a file **group** and everyone else (all).

###How Terminal Commands Work###
This part will try to superficially explain how the commands that you enter in the terminal work.

Suppose you have a program which makes a copy of an existing file (it's code is available below). Let's say it's executable version is called **copy**. To invoke the program, the user would type the following at the terminal:

	copy newfile oldfile

where "newfile" and "oldfile" are, respectively, the path of the new file and the exiting file (the ones contents you want to copy). 

The system executes the **main** method, passing it the number of parameters(**argc**) and initilizes each member of the array **argv[]** to point to a user-specified parameter. In the example above **argc** is 3, **argv[0]** points to the string of characters "copy" (by convention the 0th parameter is the name of the executable), **argv[1]** points to the string of characters newfile and **argv[2]** to the string of characters oldfile. Then the program is run.

```C
#include <fcntl.h>
char buffer[2048 ];
int version = 1; 
main (argc, argv){
	int argc;
	char* argv[];
	int fdold, fdnew;

	if (argc != 3)
	{
		printf("need 2 arguments for copy program\n") ;
		exit (1);
	}
	fdold = open (argv[1], O_RDONLY); /* open source file read only */
	if (fdold == -1)
	{
		printf("cannot open file %s\n", argv[1]);
		exit (1);
	}
	fdnew - creat(argv[2]. 0666); /* create target file rw for all "/
	if (fdnew == -1)
	{
		printf("cannot create file %s\n", argv[2]);
		exit (1);
	}
	copy(fdold, fdnew);
	exit (O);
}
	copy(old, new){
	int old, new;
	int count;
	while ( (count = read (old, buffer, sizeof(buffer))) > 0)
	write(new, buffer, count);
}
```
## Processing Environment ##
A **program** is an executable file, and a **process** is an instance of the program in execution. Many processes can exeucte silmultaneously on UNIX systems (this is called **multiprogramming** or **multitasking**). There is no logical limit to how many instances of a program can run silmuntaneously on the system.

##Building Block Primitives##
One of the block primitves is the capability to **redirect I/O**. The second block primitive os the **pipe**, which is a mechanism that allows a stream of data to be passed between the reader and the writer processes.
