/**
 * @fileoverview _loader.ts
 *
 * @version  1.1.5
 * @update   2016/10/01
 */

/// <reference path="../../typings/index.d.ts" />

'use strict';

/* ------------------------------------------------
*
* INTERFACE
*
*
------------------------------------------------ */
interface Window {
  requestAnimFrame: any;
  cancelRequestAnimFrame: any;
  [key: string]: any;
}

interface NumbersAndStringsAndObjects {
  [key: string]: any;
}

namespace Loader {
  /* ------------------------------------------------
  *
  * CONFIGURATION
  *
  *
  ------------------------------------------------ */
  export let configuration = {

  };


  /* ------------------------------------------------
  *
  * PxLoader
  *
  *
  ------------------------------------------------ */
  export class PxLoader {
    constructor(settings: any = {}) {

      // how frequently we poll resources for progress
      if (settings.statusInterval === null) {
        settings.statusInterval = 5000; // every 5 seconds by default
      }

      // delay before logging since last progress change
      if (settings.loggingDelay === null) {
        settings.loggingDelay = 20 * 1000; // log stragglers after 20 secs
      }

      // stop waiting if no progress has been made in the moving time window
      if (settings.noProgressTimeout === null) {
        settings.noProgressTimeout = Infinity; // do not stop waiting by default
      }

      let entries = [],
        // holds resources to be loaded with their status
        completionListeners = [],
        progressListeners = [],
        timeStarted,
        progressChanged = Date.now();

      /**
       * The status of a resource
       * @enum {number}
       */
      let ResourceState = {
        QUEUED: 0,
        WAITING: 1,
        LOADED: 2,
        ERROR: 3,
        TIMEOUT: 4
      };

      // places non-array values into an array.
      let ensureArray = function(val:any = null) {
        if (val === null) {
          return [];
        }

        if (Array.isArray(val)) {
          return val;
        }

        return [val];
      };

      // add an entry to the list of resources to be loaded
      this.add = function(resource:any = null) {

        // TODO: would be better to create a base class for all resources and
        // initialize the PxLoaderTags there rather than overwritting tags here
        resource.tags = new PxLoaderTags(resource.tags);

        // ensure priority is set
        if (resource.priority == null) {
          resource.priority = Infinity;
        }

        entries.push({
          resource: resource,
          status: ResourceState.QUEUED
        });
      };

      this.addProgressListener = function(callback:any = null, tags:any = null) {
        progressListeners.push({
          callback: callback,
          tags: new PxLoaderTags(tags)
        });
      };

      this.addCompletionListener = function(callback:any = null, tags:any = null) {
        completionListeners.push({
          tags: new PxLoaderTags(tags),
          callback: function(e) {
            if (e.completedCount === e.totalCount) {
              callback(e);
            }
          }
        });
      };

      // creates a comparison function for resources
      let getResourceSort = function(orderedTags:any = null) {

        // helper to get the top tag's order for a resource
        let tempOrderedTags = ensureArray(orderedTags);

        let getTagOrder = function(entry) {
          let resource = entry.resource,
            bestIndex = Infinity;
          for (let i = 0; i < resource.tags.length; i++) {
            for (let j = 0; j < Math.min(tempOrderedTags.length, bestIndex); j++) {
              if (resource.tags.all[i] === tempOrderedTags[j] && j < bestIndex) {
                bestIndex = j;
                if (bestIndex === 0) {
                  break;
                }
              }
              if (bestIndex === 0) {
                break;
              }
            }
          }
          return bestIndex;
        };

        return function(a, b) {
          // check tag order first
          let aOrder = getTagOrder(a),
            bOrder = getTagOrder(b);
          if (aOrder < bOrder) {
            return -1;
          }
          if (aOrder > bOrder) {
            return 1;
          }

          // now check priority
          if (a.priority < b.priority) {
            return -1;
          }
          if (a.priority > b.priority) {
            return 1;
          }
          return 0;
        };
      };

      this.start = function(orderedTags) {
        timeStarted = Date.now();

        // first order the resources
        let compareResources = getResourceSort(orderedTags);

        entries.sort(compareResources);

        // trigger requests for each resource
        for (let i = 0, len = entries.length; i < len; i++) {
          let entry = entries[i];
          entry.status = ResourceState.WAITING;
          entry.resource.start(this);
        }

        // do an initial status check soon since items may be loaded from the cache
        setTimeout(statusCheck, 100);
      };

      let statusCheck = function() {
        let checkAgain = false,
          noProgressTime = Date.now() - progressChanged,
          timedOut = (noProgressTime >= settings.noProgressTimeout),
          shouldLog = (noProgressTime >= settings.loggingDelay);

        for (let i = 0, len = entries.length; i < len; i++) {
          let entry = entries[i];
          if (entry.status !== ResourceState.WAITING) {
            continue;
          }

          // see if the resource has loaded
          if (entry.resource.checkStatus) {
            entry.resource.checkStatus();
          }

          // if still waiting, mark as timed out or make sure we check again
          if (entry.status === ResourceState.WAITING) {
            if (timedOut) {
              entry.resource.onTimeout();
            }
            else {
              checkAgain = true;
            }
          }
        }

        // log any resources that are still pending
        if (shouldLog && checkAgain) {
          log(false);
        }

        if (checkAgain) {
          setTimeout(statusCheck, settings.statusInterval);
        }
      };

      this.isBusy = function() {
        for (let i = 0, len = entries.length; i < len; i++) {
          if (entries[i].status === ResourceState.QUEUED || entries[i].status === ResourceState.WAITING) {
            return true;
          }
        }
        return false;
      };

      let onProgress = function(resource, statusType) {

        let entry = null,
          i, len, listeners, listener, shouldCall;

        // find the entry for the resource
        for (i = 0, len = entries.length; i < len; i++) {
          if (entries[i].resource === resource) {
            entry = entries[i];
            break;
          }
        }

        // we have already updated the status of the resource
        if (entry == null || entry.status !== ResourceState.WAITING) {
          return;
        }
        entry.status = statusType;
        progressChanged = Date.now();

        // ensure completion listeners fire after progress listeners
        listeners = progressListeners.concat(completionListeners);

        // fire callbacks for interested listeners
        for (i = 0, len = listeners.length; i < len; i++) {

          listener = listeners[i];
          if (listener.tags.length === 0) {
            // no tags specified so always tell the listener
            shouldCall = true;
          }
          else {
            // listener only wants to hear about certain tags
            shouldCall = resource.tags.intersects(listener.tags);
          }

          if (shouldCall) {
            sendProgress(entry, listener);
          }
        }
      };

      this.onLoad = function(resource) {
        onProgress(resource, ResourceState.LOADED);
      };

      this.onError = function(resource) {
        onProgress(resource, ResourceState.ERROR);
      };

      this.onTimeout = function(resource) {
        onProgress(resource, ResourceState.TIMEOUT);
      };

      // sends a progress report to a listener
      let sendProgress = function(updatedEntry, listener) {
        // find stats for all the resources the caller is interested in
        let completed = 0,
          total = 0,
          i, len, entry, includeResource;
        for (i = 0, len = entries.length; i < len; i++) {

          entry = entries[i];
          includeResource = false;

          if (listener.tags.length === 0) {
            // no tags specified so always tell the listener
            includeResource = true;
          }
          else {
            includeResource = entry.resource.tags.intersects(listener.tags);
          }

          if (includeResource) {
            total++;
            if (entry.status === ResourceState.LOADED ||
              entry.status === ResourceState.ERROR ||
              entry.status === ResourceState.TIMEOUT) {

              completed++;
            }
          }
        }

        listener.callback({
          // info about the resource that changed
          resource: updatedEntry.resource,

          // should we expose StatusType instead?
          loaded: (updatedEntry.status === ResourceState.LOADED),
          error: (updatedEntry.status === ResourceState.ERROR),
          timeout: (updatedEntry.status === ResourceState.TIMEOUT),

          // updated stats for all resources
          completedCount: completed,
          totalCount: total
        });
      };

      // prints the status of each resource to the console
      let log = this.log = function(showAll) {
        if (!window.console) {
          return;
        }

        let elapsedSeconds = Math.round((Date.now() - timeStarted) / 1000);
        window.console.log('PxLoader elapsed: ' + elapsedSeconds + ' sec');

        for (let i = 0, len = entries.length; i < len; i++) {
          let entry = entries[i];
          if (!showAll && entry.status !== ResourceState.WAITING) {
            continue;
          }

          let message = 'PxLoader: #' + i + ' ' + entry.resource.url;
          switch (entry.status) {
            case ResourceState.QUEUED:
              message += ' (Not Started)';
              break;
            case ResourceState.WAITING:
              message += ' (Waiting)';
              break;
            case ResourceState.LOADED:
              message += ' (Loaded)';
              break;
            case ResourceState.ERROR:
              message += ' (Error)';
              break;
            case ResourceState.TIMEOUT:
              message += ' (Timeout)';
              break;
          }

          if (entry.resource.tags.length > 0) {
            message += ' Tags: [' + entry.resource.tags.all.join(',') + ']';
          }

          window.console.log(message);
        }
      };

    }

    // add a convenience method to PxLoader for adding an image
    public addImage(url, tags, priority, options): any {
      let imageLoader = new PxLoaderImage(url, tags, priority, options);
      this.add(imageLoader);
      // return the img element to the caller
      return imageLoader.img;
    }

  }

  /* ------------------------------------------------
  *
  * PxLoaderTags
  *
  *
  ------------------------------------------------ */
  export class PxLoaderTags {
    private all = [];
    private first = null;
    private length = 0;
    private lookup = {};

    constructor(values) {
      if (values !== void 0) {
        // first fill the array of all values
        if (Array.isArray(values)) {
          // copy the array of values, just to be safe
          this.all = values.slice(0);
        }
        else if (typeof values === 'object') {
          for (let key in values) {
            if (values.hasOwnProperty(key)) {
              this.all.push(key);
            }
          }
        }
        else {
          this.all.push(values);
        }

        // cache the length and the first value
        this.length = this.all.length;
        if (this.length > 0) {
          this.first = this.all[0];
        }

        // set values as object keys for quick lookup during intersection test
        for (let i = 0; i < this.length; i++) {
          this.lookup[this.all[i]] = true;
        }
      }

    }

    public intersects(other): boolean {
      // handle empty values case
      if (this.length === 0 || other.length === 0) {
        return false;
      }

      // only a single value to compare?
      if (this.length === 1 && other.length === 1) {
        return this.first === other.first;
      }

      // better to loop through the smaller object
      if (other.length < this.length) {
        return other.intersects(this);
      }

      // loop through every key to see if there are any matches
      for (let key in this.lookup) {
        if (other.lookup[key]) {
          return true;
        }
      }

      return false;
    }

  }

  /* ------------------------------------------------
  *
  * PxLoaderImage
  *
  *
  ------------------------------------------------ */
  export class PxLoaderImage {
    private img_: any;
    private url_: any;
    private tags_: any;
    private priority_: any;
    private loader_: any;

    constructor(url, tags, priority, options: any = {}) {
      this.img_ = new Image();

      if (options.origin !== void 0) {
        this.img_.crossOrigin = options.origin;
      }

      this.url_ = url;
      this.tags_ = tags;
      this.priority_ = priority;
    }

    get img(): any {
      return this.img_;
    }

    set img(img: any) {
      this.img_ = img;
    }

    get url(): any {
      return this.url_;
    }

    set url(url: any) {
      this.url_ = url;
    }

    get tags(): any {
      return this.tags_;
    }

    set tags(tags: any) {
      this.tags_ = tags;
    }

    get priority(): any {
      return this.priority_;
    }

    set priority(priority: any) {
      this.priority_ = priority;
    }

    private onLoad(this_): void {
      this_.loader_.onLoad(this_);
      this_.cleanup();
    }

    private onReadyStateChange(): void {
      if (this.img_.readyState !== 'complete') {
        return;
      }
      this.loader_.onLoad(this);
    }

    private onError(this_): void {
      this_.loader_.onError(this_);
      this_.cleanup();
    }

    private onTimeoutForLoader(): void {
      this.loader_.onTimeout(this);
      this.cleanup();
    }

    private cleanup(): void {
      this.unbind('load', this.onLoad);
      this.unbind('readystatechange', this.onReadyStateChange);
      this.unbind('error', this.onError);
    }

    private bind(eventName, eventHandler): void {
      let this_ = this;
      this_.img_.addEventListener(eventName, function() {eventHandler(this_)}, false);
    }

    private unbind(eventName, eventHandler): void {
      this.img_.removeEventListener(eventName, eventHandler, false);
    }

    public start(pxLoader): void {
      // we need the loader ref so we can notify upon completion
      this.loader_ = pxLoader;

      // NOTE: Must add event listeners before the src is set.
      // We also need to use the readystatechange because sometimes
      // load doesn't fire when an image is in the cache.
      this.bind('load', this.onLoad);
      this.bind('readystatechange', this.onReadyStateChange);
      this.bind('error', this.onError);

      this.img_.src = this.url_;
    }

    public onTimeout(): void {
      if (this.img_.complete) {
        this.onLoad(this);
      }
      else {
        this.onTimeoutForLoader();
      }
    }

    // called by PxLoader to check status of image (fallback in case
    // the event listeners are not triggered).
    public checkStatus(): void {
      this.onReadyStateChange();
    }

  }

}

export default Loader;
