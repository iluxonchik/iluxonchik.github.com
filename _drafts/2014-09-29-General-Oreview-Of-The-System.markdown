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
