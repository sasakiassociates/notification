# Sasaki's Notification
### System for applying incremental patches to a data structure.


## Install
```
yarn add @strategies/notification
```


## Example

### constructor
Should be a able to take a string which is the message or a NotificationArgs object.

```
const notification = new Notification('hello');
const notification = new Notification({ message: 'hello' });
```

### defer
```
const shouldPlay =  new Notification({ message: 'hello', defer: false });

// Should not play immediately
const n = new Notification({ message: 'hello', defer: true });

// Should play when calling play
n.play();
```

### duration
```
// Should play for 5 seconds
const n = new Notification({ message: 'hello', duration: 5000 });
```

### flash
```
// Should always play latest notification
const n = new Notification({ message: 'hello' });
```

### onClick
```
// Should log 'goodbye' in the console
const n = new Notification({ message: 'hello', onClick: () => console.log('goodbye')});
```

### configure
```
Notification.configure({
    duration: 1000,
    flash: true,
});
```
