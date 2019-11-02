function WheelObservable() {
    this._observers = [];
    this._wheelValue = 0;

    // using RAF as a petty debounce
    let inProgress = false;
    const handler = event => {
        if (inProgress) return;
        inProgress = true;

        window.requestAnimationFrame(() => {
            this._process(event.deltaY);

            inProgress = false;
        });
    };

    window.addEventListener('wheel', handler);
}

WheelObservable.prototype._process = function(signal) {
    this._wheelValue += signal;
    this._wheelValue = Math.max(this._wheelValue, 0);
    this._wheelValue = Math.min(this._wheelValue, 10000);

    this.publish(this._wheelValue / 100);
};

WheelObservable.prototype.subscribe = function(observer) {
    this._observers.push(observer);
};

WheelObservable.prototype.publish = function(value) {
    this._observers.forEach(observer => {
        observer.next(value);
    });
};
