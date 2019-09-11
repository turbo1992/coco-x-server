"use strict";

var cocoLogConfig = {
    appenders: {
        //debug: { type: 'console' },
        cocoService: {
            type: 'dateFile',
            filename: './logs/cocolog/cocoService.log',
            pattern: '.yyyy-MM-dd',
            alwaysIncludePattern: true,
            daysToKeep: 30
        }
    },
    categories: {
        default: { appenders: ["cocoService"], level: "info" },
    }
}

module.exports = {
    cocoLogConfig
};