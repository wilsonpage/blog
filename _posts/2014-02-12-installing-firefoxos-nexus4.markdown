---
layout: post
title: "Installing Firefox OS on Nexus 4"
date: 2014-02-12 21:50:00
tags: firefoxos fxos
---

I just managed to flash my Nexus 4 device with Firefox OS, here are the steps I went through to do it.

### 1. Install ADB

ADB is the tool we use to communicate with our Firefox OS device from our machine. Before you can flash any devices with new versions of Firefox OS, you need to have this tool installed.

Download it with the [Android SDK](http://developer.android.com/sdk/index.html), and make sure both `adb` and `fastboot` executables are available on your command-line.

### 2. Turn Android into Firefox OS

#### 2.1 Download the [following package](https://www.dropbox.com/s/1gmogzfyb92fl1l/mako.zip)

#### 2.2 Unzip and `cd ./mako`

#### 2.3 Power off device.

#### 2.4 Power on device holding Volume Down + Power.

#### 2.5 Select reboot bootloader.

#### 2.6 Run `./flash.sh`.

Your device should then reboot as a Firefox OS device. Next we want to get the freshest version of Firefox OS onto your Nexus 4. This takes a little more work, but will mean that you will be able to develop at the bleeding edge.

### 3. Create a case-insensitive 'mountable disk image'

I know, sounds like gibberish right? But B2G is built on Android, which requires a case-insensitive file system for particular builds. Most B2G build don't require this, but the Nexus 4 does.

MacOSX does not have a case-insensitive file system by default, but allows you to create virtual drives that do. The following instructions were copied from [here](https://developer.mozilla.org/en-US/Firefox_OS/Firefox_OS_build_prerequisites#Be_aware_of_Mac_file_system_case_sensitivity).

#### 3.1 Create a new drive

{% highlight bash %}
hdiutil create -volname 'firefoxos' -type SPARSE -fs 'Case-sensitive Journaled HFS+' -size 40g ~/firefoxos.sparseimage
{% endhighlight %}

#### 3.2 Mount the drive

{% highlight bash %}
open ~/firefoxos.sparseimage
{% endhighlight %}

#### 3.3 cd into it

{% highlight bash %}
cd /Volumes/firefoxos/
{% endhighlight %}

### 4. Clone the B2G onto your mounted drive

{% highlight bash %}
git clone https://github.com/mozilla-b2g/B2G.git
{% endhighlight %}

### 5. 'Config' B2G for this device

{% highlight bash %}
./config.sh nexus-4
{% endhighlight %}

**Warning: this could take a while...**

### 6. 'Build' B2G

{% highlight bash %}
./build.sh
{% endhighlight %}

**Warning: this could take a while...**

If at any point throughout this process the build scripts error, it is most likely that you are missing a dependency. Check what the error message is complaining about, and go use [HomeBrew](http://brew.sh/) to install it.

### 7. Flash new Gaia and Gecko

{% highlight bash %}
./flash.sh gecko
./flash.sh gaia
{% endhighlight %}

You now have a completely fresh, up-to-date version of Firefox OS on your Nexus device.
