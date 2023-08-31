import { createLogger, format, transports } from "winston";

const formatter = format((info) => {
    info.pid = `Gmail PID: ${process.pid}`;
    return info;
})();

const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({
            level: 'info',
            filename: './logs/logInfo.log'
        }),
        new transports.File({
            level: 'warn',
            filename: './logs/logWarning.log'
        }),
        new transports.File({
            level: 'error',
            filename: './logs/logError.log'
        })
    ],
    format: format.combine(
        formatter,
        format.json(),
        format.timestamp(),
        format.prettyPrint(),
        format.colorize()
    ),
    statusLevels: true
});

export default logger;