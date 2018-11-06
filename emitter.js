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
    let events = {};

    function parseEvent(event) {
        let substrings = event.split('.');
        for (let i = 1; i < substrings.length; i++) {
            substrings[i] = substrings[i - 1] + '.' + substrings[i];
        }

        return (substrings.reverse());
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */

        on: function (event, context, handler) {
            if (events[event] === undefined) {
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
            for (let changeEvent in events) {
                if (changeEvent.startsWith(event + '.') || changeEvent === event) {
                    events[changeEvent] = events[changeEvent]
                        .filter(person => person.context !== context);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */

        emit: function (event) {
            let emitEvent = parseEvent(event);
            emitEvent.forEach(callEvent => {
                if (events[callEvent] !== undefined) {
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
            if (times <= 0) {
                this.on(event, context, handler);

                return this;
            }
            let callCount = 0;
            this.on(event, context, function () {
                if (callCount < times) {
                    handler.call(context);
                    callCount = ++callCount;
                }
            });

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
