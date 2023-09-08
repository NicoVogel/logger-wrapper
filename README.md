# LoggerWrapper

Example of how a wrapper for a logger could look like.
Both **node** and **browser** APIs are the same in this case.

## Why would you do this?

The common way is to select a logger library (or non at all) and then just use it everywhere in your code.
This approach has two main disadvantages:

1. You do not necessary think about what you actually need
2. Changing the logger later on is really hard, as it is in your entire code base

So, instead of simply using `console.log` or any logger library, just define your own interface that contains your needs.
Then you can start cheap and just continue to use `console.log` under the hood or directly search for a more sophisticated logging library fits your needs.

> Your logger interface can also be really simple at first and grow with time as your needs increase.

## Side note

There is no particular reason the same interface for frontend and backend is used here.
Just wanted to use this opportunity to try out testing one library in both environments.
And this resulted in creating one interface for both.

Would I do the same in production?

Probably not.

## Open todo's

In this repo is an example vitest setup to run tests in both browser and node environment.
As of now, there are still some issues with the setup.
- [@nx/vite:test does not find tests with custom vitest config](https://github.com/nrwl/nx/issues/19076 )
- [vitest browser __vi_esm_0__.default is not a function ](https://github.com/vitest-dev/vitest/issues/4097)
