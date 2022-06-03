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

    public readonly args?: NotificationArgs;
    public readonly element: HTMLDivElement;
    private player: number;
    private flasher: number;
    private readonly drawer: HTMLDivElement;

    constructor(args: string|NotificationArgs)  {
        if (!Notification.drawer) {
            Notification.createDrawer();
        }

        this.drawer = Notification.drawer;

        const el = this.element = document.createElement('div');
        el.className = "Notification";

        el.addEventListener('mouseenter', () => clearTimeout(this.player));
        el.addEventListener('mouseleave', () => this._play());
        el.addEventListener('click', () => this.finish());

        if (typeof args === 'string') {
            el.innerText = args;
            this.play();
        }
        else {
            el.innerText = args.message || '';

            if (args.className) {
                el.className += ` ${args.className}`;
            }

            if (args.onClick) {
                el.addEventListener('click', () => args.onClick());
            }

            this.args = args;

            if (args.defer !== true || !Notification.defer) {
                this.play();
            }
        }
    }

    public finish() {
        clearTimeout(this.player);
        clearInterval(this.flasher);

        this.element.classList.add('finished');

        this.player = setTimeout(() => {
            this.drawer.removeChild(this.element);
        }, 1000);
    }

    public play() {
        Notification.current = this; 
        this.drawer.appendChild(this.element);

        if (this.args.flash === true || Notification.flash) {
            this.flash();
        }

        this._play();
    }

    private _play() {
        clearTimeout(this.player);

        this.element.classList.remove('finished');

        this.player = setTimeout(() => {
            this.finish();
        }, this.args.duration || Notification.duration);
    }

    private flash() {
        clearInterval(this.flasher);
        
        const { title } = document;

        this.flasher = setInterval(() => {
            if (Notification.current === this) {
                if (document.title === title) {
                    document.title = this.args.message;
                }
                else {
                    document.title = title;
                }
            }
            else {
                clearInterval(this.flasher);
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
    private static drawer?: HTMLDivElement;
    private static current?: Notification;

    public static configure(config: NotificationConfig) {
        if (config.mount && config.mount !== Notification.mount) {
            Notification.mount = config.mount;
            Notification.createDrawer();
        }

        Notification.defer = config.defer !== undefined ? config.defer : Notification.defer;
        Notification.duration = config.duration !== undefined ? config.duration : Notification.duration;
        Notification.flash = config.flash !== undefined ? config.flash : Notification.flash;
    }

    private static createDrawer() {
        if (Notification.drawer) {
            Notification.drawer.parentNode.removeChild(Notification.drawer);
        }

        const drawer = document.createElement('div');
        drawer.className = 'Notification__Drawer';

        Notification.mount.appendChild(drawer);
        Notification.drawer = drawer;
    }

};
