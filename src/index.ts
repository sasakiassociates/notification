/**
 * Notification
 */


export type NotificationGlobals = {
    defer?: boolean;
    duration?: number;
    flash?: boolean;
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

    constructor(args: string|NotificationArgs)  {
        if (!Notification.drawer) {
            Notification.createDrawer();
        }

        const el = document.createElement('div');
        el.className = "Notification";

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

    public play() {
        
    }


    /**
     * Static
     */

    public static mount: HTMLElement = document.querySelector('body');
    public static defer: boolean = false;
    public static duration: number = 3000;
    public static flash: boolean = false;
    private static drawer?: HTMLDivElement;

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
