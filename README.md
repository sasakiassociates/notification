# Sasaki's Notification
### Pure JS notifications; popups and push enabled.

# Documentation

## Install
```
yarn add @strategies/notification
```


## Usage

```
new Notification('hello');
new Notification({ message: 'hello' });
```

### Lifecycle
There are two lifecycle methods: `.play()` and `.finish()`. All notifications can 
be replayed instead of having to create a new Notification each time you want to display
that notification.

```
const notification = new Notification('Repeat me');
notification.play();
notification.play();
```

### Attach a click event to a notification
```
let notification: Notification;
notification = new Notification({
    message: 'A will stay open until clicked',
    duration: Infinity,
    onClick: () => notification.finish(),
});
```

### Deferred notifications
If you want to create notifications to be used later, you can always defer them.

```
const notification = new Notification({ message: 'Hello', defer: true });

// notification won't play until you tell it to play
notification.play();
```

### Push notifications
If you desire to use the push notification feature of this package, you must supply
an empty JS file in your public folder to be used as a Service Worker. By default, 
this file is `./notification.js`.


## Configuration
#### Environment
You can configure the Notification environment statically on the Notification class. 
_Note: these configuration settings are the default values._

```
Notification.configure({
    mount: document.querySelector('body'),
    serviceWorker: './notification.js',
});
```

#### Notifications
You can configure the default settings for all notifications or pass the same
configuration options into each Notification instance.

```
Notification.configure({
    duration: 3000,
    defer: false,
    flash: false,
    push: false,
});

new Notification({
    message: 'Save Successful',
    duration: 2000,
});
```
