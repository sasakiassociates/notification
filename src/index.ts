/**
 * Notification
 */


export default class Notification {

    private static drawer?: HTMLDivElement;

    constructor()  {
        if (!Notification.drawer) {
            Notification.mount();
        }
    }

    private static mount() {
        const drawer = document.createElement('div');
        drawer.className = 'Notification__Drawer';

        document.querySelector('body').appendChild(drawer);

        Notification.drawer = drawer;
    }

};
