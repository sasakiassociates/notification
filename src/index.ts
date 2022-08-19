/**
 * Notification
 */


import './index.scss';



export type NotificationGlobals = {
    defer?: boolean;   // if true, notifications will not play upon instantiantion.
    duration?: number; // amount of time in milliseconds that a notification will show.
    flash?: boolean;   // if true, the latest notification will repeatedly flash in the tab title.
    push?: boolean;    // if true, the notification will appear as a push notification rather than locally on the webpage
}

export type NotificationArgs = NotificationGlobals & {
    message: string;
    className?: string;
    onClick?: () => any;
};

export type NotificationConfig = NotificationGlobals & {
    mount?: HTMLElement;
    serviceWorker?: string;
};


export default class Notification {

    public finished: boolean = false;
    public readonly args: NotificationArgs = { message: '' };
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
        el.addEventListener('mouseleave', () => !this.finished && this._play());
        el.addEventListener('click', () => this.finish());
        
        
        if (typeof args === 'string') {
            el.innerText = args;
            this.play();
        }
        else {
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
            
            if (Notification.defer !== undefined){
                if (args.defer !== true){
                    this.play()
                }
            }
            else if (Notification.defer !== true){
                this.play()
            }
        }
    }
  
    public finish() {
        this.finished = true;

        clearTimeout(this._player);
        clearInterval(this._flasher);

        this.element.classList.add('finished');

        this._player = setTimeout(() => {
            this._drawer.removeChild(this.element);
        }, 500);
    }

    public play() {
        Notification._current = this; 
        this._drawer.appendChild(this.element);

        if (this.args.flash === true || Notification.flash) {
            this._flash();
        }

        if (!(!document.hidden && (this.args.push === false || (this.args.push === undefined && Notification.push !== true)))) {
            Notification._showPushNotification(document.title, this.args.message);
        }

        this._play();
    }

    private _play() {
        this.finished = false;
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
    public static push: boolean = false;
    public static serviceWorker: string = './notification.js';
    private static _drawer?: HTMLDivElement;
    private static _current?: Notification;
    private static _serviceWorker?: any;

    public static configure(config: NotificationConfig) {
        if (config.mount && config.mount !== Notification.mount) {
            Notification.mount = config.mount;
            Notification._createDrawer();
        }

        Notification.defer = config.defer !== undefined ? config.defer : Notification.defer;
        Notification.duration = config.duration !== undefined ? config.duration : Notification.duration;
        Notification.flash = config.flash !== undefined ? config.flash : Notification.flash;
        Notification.push = config.push !== undefined ? config.push: Notification.push;
        Notification.serviceWorker = config.serviceWorker !== undefined ? config.serviceWorker : Notification.serviceWorker;
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

    private static async _registerServiceWorker() {
        return await navigator.serviceWorker.register(Notification.serviceWorker);
    }

    private static async _requestNotificationPermission() {
        return (await window.Notification.requestPermission()) === 'granted';
    }

    private static async _showPushNotification(title: string, body: string) {
        const options = {
            title,
            body,
        };

        if (!Notification._serviceWorker) {
            Notification._serviceWorker = await Notification._registerServiceWorker();
        }
      
        if(await Notification._requestNotificationPermission()) { 
            navigator.serviceWorker.ready.then(async function(registration) {
                registration.showNotification(title, options) 
            });
        }
    }

};


