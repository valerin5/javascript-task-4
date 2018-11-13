'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const events = {};

    function parseEvent(event) {
        const substrings = event.split('.');
        const newEvent = substrings.reduce((accum, substr) => {
            if (accum.length === 0) {
                return [substr];
            }
            accum.unshift(accum[0] + '.' + substr);

            return accum;
        }, []);

        return newEvent;
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */

        on: function (event, context, handler) {
            if (!events.hasOwnProperty(event)) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */

        off: function (event, context) {
            const startPointEvent = event + '.';
            Object.keys(events).forEach(changeEvent => {
                if (changeEvent === event || changeEvent.startsWith(startPointEvent)) {
                    events[changeEvent] = events[changeEvent]
                        .filter(person => person.context !== context);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */

        emit: function (event) {
            const emitEvent = parseEvent(event);
            emitEvent.forEach(callEvent => {
                if (events.hasOwnProperty(callEvent)) {
                    events[callEvent].map(person => person.handler.call(person.context));
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */

        several: function (event, context, handler, times) {
            let callCount = 0;
            this.on(event, context, times <= 0 ? handler : function () {
                if (callCount < times) {
                    handler.call(context);
                    callCount++;
                }

            });

            /* if (times <= 0) {
                this.on(event, context, handler);

                return this;
            }
            let callCount = 0;
            this.on(event, context, function () {
                if (callCount < times) {
                    handler.call(context);
                    callCount++;
                }
            }); */

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */

        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                this.on(event, context, handler);

                return this;
            }

            let callCount = 0;
            this.on(event, context, function () {
                if (callCount % frequency === 0) {
                    handler.call(context);
                }
                callCount = ++callCount;
            });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
