import { FastifyRateLimitStore, RateLimitOptions, RateLimitPluginOptions } from "@fastify/rate-limit";
import { RouteOptions } from "fastify";
import ms from "ms";

class RequestLookupStore implements FastifyRateLimitStore {

  private options: RateLimitOptions
  private current: number;

  constructor(options: RateLimitOptions) {
    this.options = options;
    this.current = 0;
  }

  // request counter
  incr = (key: string, callback: (err: Error | null, result?: { current: number; ttl: number }) => void): void => {
    let timeWindow = this.options.timeWindow;
    if (typeof timeWindow === "string") timeWindow = ms(timeWindow);
    this.current++
    callback(null, { current: this.current, ttl: timeWindow - (this.current * 1000) })
  }

  // setup store child to lookup requests
  child = (routeOptions: RouteOptions & { path: string; prefix: string }): FastifyRateLimitStore => {
    // We create a merged copy of the current parent parameters with the specific
    // route parameters and pass them into the child store.
    const childParams = { ...this.options, ...routeOptions };
    const store = new RequestLookupStore(childParams);
    // Here is where you may want to do some custom calls on the store with the information
    // in routeOptions first...
    // store.setSubKey(routeOptions.method + routeOptions.url)
    return store;
  }
}

interface IOptions extends RateLimitOptions, RateLimitPluginOptions { }

export const rateLimitOptions: IOptions = {
  global: false, // not setting it on all requests
  max: 10,
  ban: 2, // since ban doesn't work well with distributed system, we'll probably need a update our lookup system for this
  timeWindow: 1000 * 60, // 1 minute 
  store: RequestLookupStore
}
