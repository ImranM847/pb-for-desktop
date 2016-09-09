'use strict';

pb.notifier.notify = function(options) {
    if (!window.Notification) {
        pb.devtools('Notifications not available');
        return;
    }

    if (pb.isSnoozed()) {
        pb.devtools('Not showing notification ' + options.key + ', snoozed');

        pb.notifier.active[options.key] = options;
        return;
    }

    var subOptions = {
        'tag': options.key
    };

    if (options.message) {
        subOptions.body = options.message;
    }

    var notification = new Notification(options.title, subOptions);

    notification.onclick = function() {
        if (options.onclick) {
            options.onclick();
        }

        if (options.onclose) {
            options.onclose();
        }
    };

    notification.onclose = function() {
        delete pb.notifier.active[options.key];
        pb.dispatchEvent('notifications_changed');
    };

    options.notification = notification;
};

pb.notifier.dismiss = function(key) {
    var options = pb.notifier.active[key];
    if (options) {
        options.notification.close();
    }
};
