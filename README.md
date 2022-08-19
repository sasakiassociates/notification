# Sasaki's Notification
### Pure JS notifications; popups and push enabled.

# Documentation

## Install
```sh
yarn add @strategies/notification
```


## Usage
Unless deferred, all Notification instances will display immediately upon invocation, no assignment required.

```js
new Notification('hello');
new Notification({ message: 'hello' });
```

### Lifecycle
There are two lifecycle methods: `.play()` and `.finish()`. All notifications can 
be replayed instead of having to create a new Notification each time you want to display
that notification.

```js
const notification = new Notification('Repeat me');
notification.play();
notification.play();
```

### Attach a click event to a notification
```ts
let notification: Notification;
notification = new Notification({
    message: 'I will stay open until clicked',
    duration: Infinity,
    onClick: () => notification.finish(),
});
```

### Deferred notifications
If you want to create notifications to be used later, you can always defer them.

```js
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

```js
Notification.configure({
    mount: document.querySelector('body'),
    serviceWorker: './notification.js',
});
```

#### Notifications
You can configure the default settings for all notifications or pass the same
configuration options into each Notification instance.

```js
Notification.configure({
    duration: 3000,  // amount of time in milliseconds that a notification will show.
    defer: false,    // if true, notifications will not play upon instantiantion.
    flash: false,    // if true, the latest notification will repeatedly flash in the tab title.
    push: false,     // if true, the notification will appear as a push notification if the tab is not in focus.
});

new Notification({
    message: 'Save Successful',
    duration: 2000,
});
```
