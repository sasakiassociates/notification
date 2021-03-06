/**
 * Notification
 */


import './index.scss';
// import './service.js';



/**
 * Push Notification
 * 
 */



// main(); we will not call main in the beginning.

//         registerServiceWorker().then(function (registration) {
//             let serviceWorker;
//             if (registration.installing) {
//                 console.log('installing')
//                 serviceWorker = registration.installing;
//                 document.querySelector('#kind').textContent = 'installing';
//             } else if (registration.waiting) {
//                 console.log('waiting')
//                 serviceWorker = registration.waiting;
//                 document.querySelector('#kind').textContent = 'waiting';
//             } else if (registration.active) {
//                 console.log('active')
//                 serviceWorker = registration.active;
//                 document.querySelector('#kind').textContent = 'active';
//             }
//             if (serviceWorker) {
//                 // logState(serviceWorker.state);
//                 serviceWorker.addEventListener('statechange', function (e) {
//                     // logState(e.target.state);
//                 });
//             }
//             console.log('registered')
//         }).catch (function (error) {
//             // Something went wrong during registration. The service-worker.js file
//             // might be unavailable or contain a syntax error.
//         });
//     } else {
//         // The current browser doesn't support service workers.
//         // Perhaps it is too old or we are not in a Secure Context.
//         throw new Error('No Service Worker support!')
//     }
// }

    //If `serviceWorker` is registered and ready
    // navigator.serviceWorker.ready
    // .then(function (registration) {
    //   registration.pushManager.getSubscription()
    //   .catch(function (error) {
    //     console.error('Error occurred while enabling push ', error);
    //   });
    // });
    // console.log('permission granted')

  

/**
 * Notification
 */


export type NotificationGlobals = {
    defer?: boolean;   // if true, notifications will not play upon instantiantion.
    duration?: number; // ammount of time in milliseconds that a notification will show.
    flash?: boolean;   // if true, the latest notification will repeatedly flash in the tab title.
}

export type NotificationArgs = NotificationGlobals & {
    message: string;
    className?: string;
    onClick?: () => any;
};

export type NotificationConfig = NotificationGlobals & {
    mount?: HTMLElement;
};


export default class Notification {
    //@ts-ignor
    public readonly args: NotificationArgs = { message: '' };
    //
    public readonly element: HTMLDivElement;

    private _player: ReturnType<typeof setTimeout>;
    private _flasher: ReturnType<typeof setInterval>;
    private readonly _drawer: HTMLDivElement;

    constructor(args: string|NotificationArgs)  {
        if (!Notification._drawer) {
            Notification._createDrawer();
        }

        this._drawer = Notification._drawer;

        const el = this.element = document.createElement('div');
        el.className = "Notification";

        el.addEventListener('mouseenter', () => clearTimeout(this._player));
        el.addEventListener('mouseleave', () => this._play());
        el.addEventListener('click', () => this.finish());
        
        if (typeof args === 'string') {
            el.innerText = args;
            this.play();
        }
        else {
            console.log('args', args)
            console.log('args.message', args.message)
            if (args.message != null) {
                el.innerText = args.message;
            }
            
            if (args.className) {
                el.className += ` ${args.className}`;
            }

            if (args.onClick) {
                el.addEventListener('click', () => args.onClick());
            }

            this.args = args;
            
            //individual attributes of notification should override general configuration of class

            if (args.defer !== undefined){
                if (args.defer !== true){
                    this.play()
                }
            }
            else if (Notification.defer !== true){
                this.play()
            }
          
        }
        
    }

      
    static check = () => {
        if (!('serviceWorker' in navigator)) {
            throw new Error('No service worker support!')
        }
        if (!('PushManager' in window)) {
            throw new Error('No Push API Support!')
        }
    }

    static registerServiceWorker = async () => {
        const swRegistration = await navigator.serviceWorker.register('./service.js'); //notice the file name
        return swRegistration
    }

    static requestNotificationPermission = async () => {
        console.log('requesting')
        const permission = await window.Notification.requestPermission()
        // value of permission can be 'granted', 'default', 'denied'
        // granted: user has accepted the request
        // default: user has dismissed the notification permission popup by clicking on x
        // denied: user has denied the request.
        if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification')
        }
        console.log('requested')
    }

    static showLocalNotification = (title, body, swRegistration) => {
        console.log('aaaa')
        const options = {
            body,
            // here you can add more properties like icon, image, vibrate, etc.
        };
        console.log("REGISTRATION" , swRegistration)
        console.log("aaaaa" , swRegistration.showNotification(title, options))
        swRegistration.showNotification(title, options);
    }

    public finish() {
        clearTimeout(this._player);
        clearInterval(this._flasher);

        this.element.classList.add('finished');

        this._player = setTimeout(() => {
            this._drawer.removeChild(this.element);
        }, 1000);
    }

    public play() {
        Notification._current = this; 
        this._drawer.appendChild(this.element);

        if (this.args.flash === true || Notification.flash) {
            this._flash();
        }

        this._play();
    }

    private _play() {
        clearTimeout(this._player);

        this.element.classList.remove('finished');

        this._player = setTimeout(() => {
            this.finish();
        }, this.args.duration || Notification.duration);
    }

    private _flash() {
        clearInterval(this._flasher);
        
        const { title } = document;

        this._flasher = setInterval(() => {
            if (Notification._current === this) {
                if (document.title === title) {
                    document.title = this.args.message;
                }
                else {
                    document.title = title;
                }
            }
            else {
                clearInterval(this._flasher);
            }
        }, 500);
    }


    /**
     * Static
     */

    public static mount: HTMLElement = document.querySelector('body');
    public static defer: boolean = false;
    public static duration: number = 3000;
    public static flash: boolean = false;
    private static _drawer?: HTMLDivElement;
    private static _current?: Notification;

    public static configure(config: NotificationConfig) {
        if (config.mount && config.mount !== Notification.mount) {
            Notification.mount = config.mount;
            Notification._createDrawer();
        }

        Notification.defer = config.defer !== undefined ? config.defer : Notification.defer;
        Notification.duration = config.duration !== undefined ? config.duration : Notification.duration;
        Notification.flash = config.flash !== undefined ? config.flash : Notification.flash;
    }

    private static _createDrawer() {
        if (Notification._drawer) {
            Notification._drawer.parentNode.removeChild(Notification._drawer);
        }

        const drawer = document.createElement('div');
        drawer.className = 'Notification__Drawer';

        Notification.mount.appendChild(drawer);
        Notification._drawer = drawer;
    }

};


