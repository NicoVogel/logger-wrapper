# LoggerWrapper

Example of how a wrapper for a logger could look like.
Both **node** and **browser** APIs are the same in this case.

## Why would you do this?

The common way is to select a logger library (or non at all) and then just use it everywhere in your code.
This approach has two main disadvantages:

1. You do not neccessarly think about what you actually need
2. Changing the logger later on is really hard, as it is in your entire code base

So, instead of simply using `console.log` or any logger library, just define your own interface that contains your needs.
Then you can start cheap and just continue to use `console.log` under the hood or directly serach for a more suffisticated logging library fits your needs.

> Your logger interface can also be really simple at first and grow with time as your needs increase.

## open TODO's in this repo

1. fix vitest browser config
