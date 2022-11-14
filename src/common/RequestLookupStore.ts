import { FastifyRateLimitOptions, FastifyRateLimitStore } from "@fastify/rate-limit";
import { RouteOptions } from "fastify";

class RequestLookupStore implements FastifyRateLimitStore {

  private options: { [key: string]: any }
  private current: number;

  constructor(options: FastifyRateLimitOptions) {
    this.options = options;
    this.current = 0;
  }

  // request counter
  incr = (key: string, callback: (err: Error | null, result?: { current: number; ttl: number }) => void): void => {
    const timeWindow = this.options.timeWindow;
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

export { RequestLookupStore }