# logger

This library contains a common logger abstraction for both browser and node.
The abstraction uses the package `pino` to handle the logging.
The common interface describes the contract that should be uphold and the abstracted logger package can be changed at any point in time.

## Features added to `pino`

### identifying loggers

Loggers are identified by their name and only one instance per name exists.
The context (called chidings in `pino`) for a logger would allow a lot more then just a name, but to keep it simple and exchangeable it was reduced to just a name.

### styling for browser console log messages

Log output for browser consoles are enriched with some css to make it look nicer

### buffer for transports

The browser buffers all logs until the first transport is attached.
This allows to define the transport in an async way and not miss any log output.
