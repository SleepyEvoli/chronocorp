# ChronoCorp

ChronoCorp is a front-end tool designed for Active Collabs, simplifying time tracking and task management.\
Originally developed as a final exam project for Intercorp, it aims to make your workflow more efficient.\
Its main intention is using the time tracking system, but it also includes a task management system.

## Features

- Time Tracker with Drag and Drop
- Access Subtasks comments, and time records directly from your time tracker
- Access your pinned tasks and their comments
- Keep your tracking organized by day and submit when you are ready with one click
- Edit your already submitted times quick with inline editing
- Quick Task Search
- Fast Task editing
- Open Jitsi Meet from the task view
- Go directly to the task in ActiveCollab
- Lazy Tracking for quick Time tracking with just one click
- Manage your assignments just by drag and drop
- Mini Time Tracker adjusted for a smaller window
- The rich text editor supports to copy and paste images right into the editor

## Brief guide

### Time Records and Trackings

We distinguish between time records and trackings. \
Time records refer to submitted times, while trackings represent the times you are actively tracking.\
The focused tracking is the one currently being tracked, visible in the timer on the dashboard.

### Add a tracking

To start tracking time, you can

- Add a tracking in the task view by clicking the plus icon on the timetable
- Start tracking in the assignment view
- Drag and drop a pinned task into the time tracker

This automatically creates a tracking visible on the dashboard.

### Change your focused tracking

You can switch your focused tracking by dragging and dropping an existing tracking or pinned task into the time tracker
on the dashboard.

### Submit your trackings

Submit all your tracked times for the day by clicking the large submit button on the table in the dashboard.
You can also submit an individual tracking by right-clicking on it.

You can see the trackings on your dashboard or on the task itself.

### Edit time records and trackings

Time records and trackings can be edited inline for a faster workflow.
Simply click on a time record to make changes, and they will be saved automatically.

### Edit Task Assignments

Task assignments can be changed by dragging and dropping them in their dedicated assignment (View) or directly within
the task itself.

### Lazy Records

To add a lazy record, click the rocket button in the task detail view.\
Once created, lazy records appear in the right feature bar. Clicking on them instantly creates a time record.

### Quick Task Search

Before you can use the quick task search, you need to pull them by clicking the refresh button.

### Example `chronocorp.desktop`

```
[Desktop Entry]
Name=ChronoCorp 0.0.10
Exec=/home/vinzenz/My_Applications/chronocorp/ChronoCorp-0.0.10.AppImage --no-sandbox
Icon=/home/vinzenz/My_Applications/chronocorp/icon.png
Terminal=false
Type=Application
```

## Using the console in the application

I enabled the console for debugging purposes. `Ctrl + Shift + I`

## Use

### Using on Linux (Debian Based)

To use ChronoCorp on Linux, you need to disable the Sandbox.\
Make sure you installed `libfuse2`

```
sudo apt install -y libfuse2 && ./chronocorp.AppImage --no-sandbox
```

### Using on Windows

Just open the `.exe` file

## Deployment

Building executable for the current platform:\
`npm run electron:build`

Using Docker to build the executables for Windows:\
`docker run --rm -v ${PWD}:/project -v ${PWD}/dist_electron:/project/dist_electron electronuserland/builder:wine bash -c "npm install --arch=x64 --platform=win32 && npm run build && npm run electron:build-win"`

Using Docker to build the executables for Linux:\
`docker run --rm -v ${PWD}:/project -v ${PWD}/dist_electron:/project/dist_electron electronuserland/builder:10 bash -c "npm install --platform=linux && npm run build && npm run electron:build-linux"`

Using Docker to build the executables for macOS:\
`docker run --rm -v ${PWD}:/project -v ${PWD}/dist_electron:/project/dist_electron electronuserland/builder:wine bash -c "npm install && npm run build && npm run electron:build-mac"`

Building for macOS (Needs a macOS machine):\
`rm ./package-lock.json && npm install && npm run build && npm run electron:build --mac`

**Important:** On Linux (When not using docker) and Mac the `node_modules` and the `package-lock.json` need to be
deleted before building the
applications.

### Auto Update

This will create the application and a `latest.yml` file for the auto-updater.

Put the files on a server together with the `latest.yml` in the same folder \
The publishing URL in the `package.json` will look for the folder URL and automatically search for updates by reading
the
`latest.yml` file and check for the latest application version.

## Presentation

Dashboard with Drag and Drop
![image1](https://i.imgur.com/SbPN902.png)

Overview Last Time Submits
![image2](https://i.imgur.com/HzmC2n2.png)

Project & Task List
![image3](https://i.imgur.com/W3RyVMV.png)

Task Detail View
![image4](https://i.imgur.com/FCirFAd.png)

Task Detail View with Comments
![image5](https://i.imgur.com/atYxQE2.png)

Task Assignment Overview and Drag and Drop
![image6](https://i.imgur.com/dQgdvcK.png)

Timer View in small format for smaller screens or phone
![image7](https://i.imgur.com/8YCJJOd.png)

Drag and Drop Windows possible from the Dashboard
![image8](https://i.imgur.com/2QO7PI7.png)
