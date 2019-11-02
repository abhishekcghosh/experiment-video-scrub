function ScrollObservable() {
    this._observers = [];

    // using RAF as a petty debounce
    let inProgress = false;
    const handler = () => {
        if (inProgress) return;
        inProgress = true;

        window.requestAnimationFrame(() => {
            this._process();

            inProgress = false;
        });
    };

    window.addEventListener('scroll', handler);
}

ScrollObservable.prototype._process = function() {
    const viewportHeight = document.documentElement.clientHeight;
    const documentHeight = document.body.clientHeight;
    const scrolled = Math.max(
        window.scrollY,
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
    );

    const scrolledPercentage = Math.round((100 * (100 * scrolled)) / (documentHeight - viewportHeight)) / 100;

    this.publish(scrolledPercentage);
};

ScrollObservable.prototype.subscribe = function(observer) {
    this._observers.push(observer);
};

ScrollObservable.prototype.publish = function(value) {
    this._observers.forEach(observer => {
        observer.next(value);
    });
};
