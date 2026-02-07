import { clsx as clsx$1 } from "clsx";
import * as devalue from "devalue";
import { router, UseFormUtils, mergeDataIntoQueryString, isUrlMethodPair, formDataToObject, resetFormFields, getInitialPageFromDOM, setupProgress, config as config$1 } from "@inertiajs/core";
import { createValidator, toSimpleValidationErrors, resolveName } from "laravel-precognition";
import { cloneDeep, isEqual, get as get$1, has, set as set$1, escape } from "lodash-es";
import createServer from "@inertiajs/core/server";
const HYDRATION_START = "[";
const HYDRATION_END = "]";
const ELEMENT_IS_NAMESPACED = 1;
const ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
const ELEMENT_IS_INPUT = 1 << 2;
const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (name === "hidden" && value !== "until-found") {
    is_boolean = true;
  }
  if (value == null || !value && is_boolean) return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function clsx(value) {
  if (typeof value === "object") {
    return clsx$1(value);
  } else {
    return value ?? "";
  }
}
const whitespace = [..." 	\n\r\f \v\uFEFF"];
function to_class(value, hash, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash) {
    classname = classname ? classname + " " + hash : hash;
  }
  if (directives) {
    for (var key in directives) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a = 0;
        while ((a = classname.indexOf(key, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key in styles) {
    var value = styles[key];
    if (value != null && value !== "") {
      css += " " + key + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0; i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}
const noop = () => {
};
function fallback(value, fallback2, lazy = false) {
  return value === void 0 ? lazy ? (
    /** @type {() => V} */
    fallback2()
  ) : (
    /** @type {V} */
    fallback2
  ) : value;
}
const STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function lifecycle_outside_component(name) {
  {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
let untracking = false;
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
const VOID_ELEMENT_NAMES = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
function is_void(name) {
  return VOID_ELEMENT_NAMES.includes(name) || name.toLowerCase() === "!doctype";
}
const DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
function is_boolean_attribute(name) {
  return DOM_BOOLEAN_ATTRIBUTES.includes(name);
}
const RAW_TEXT_ELEMENTS = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function is_raw_text_element(name) {
  return RAW_TEXT_ELEMENTS.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    name
  );
}
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop = null;
  const subscribers = /* @__PURE__ */ new Set();
  function set2(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set2(fn(
      /** @type {T} */
      value
    ));
  }
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set2, update) || noop;
    }
    run(
      /** @type {T} */
      value
    );
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set: set2, update, subscribe: subscribe2 };
}
function get(store) {
  let value;
  subscribe_to_store(store, (_) => value = _)();
  return value;
}
function subscribe_to_store(store, run, invalidate) {
  if (store == null) {
    run(void 0);
    return noop;
  }
  const unsub = untrack(
    () => store.subscribe(
      run,
      // @ts-expect-error
      invalidate
    )
  );
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
const BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
const EMPTY_COMMENT = `<!---->`;
let controller = null;
function abort() {
  controller?.abort(STALE_REACTION);
  controller = null;
}
function await_invalid() {
  const error = new Error(`await_invalid
Encountered asynchronous work while rendering synchronously.
https://svelte.dev/e/await_invalid`);
  error.name = "Svelte error";
  throw error;
}
function invalid_csp() {
  const error = new Error(`invalid_csp
\`csp.nonce\` was set while \`csp.hash\` was \`true\`. These options cannot be used simultaneously.
https://svelte.dev/e/invalid_csp`);
  error.name = "Svelte error";
  throw error;
}
function server_context_required() {
  const error = new Error(`server_context_required
Could not resolve \`render\` context.
https://svelte.dev/e/server_context_required`);
  error.name = "Svelte error";
  throw error;
}
var ssr_context = null;
function set_ssr_context(v) {
  ssr_context = v;
}
function setContext(key, context) {
  get_or_init_context_map().set(key, context);
  return context;
}
function get_or_init_context_map(name) {
  if (ssr_context === null) {
    lifecycle_outside_component();
  }
  return ssr_context.c ??= new Map(get_parent_context(ssr_context) || void 0);
}
function push(fn) {
  ssr_context = { p: ssr_context, c: null, r: null };
}
function pop() {
  ssr_context = /** @type {SSRContext} */
  ssr_context.p;
}
function get_parent_context(ssr_context2) {
  let parent = ssr_context2.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
function unresolved_hydratable(key, stack) {
  {
    console.warn(`https://svelte.dev/e/unresolved_hydratable`);
  }
}
function get_render_context() {
  const store = als?.getStore();
  {
    server_context_required();
  }
  return store;
}
let als = null;
let text_encoder;
let crypto;
async function sha256(data) {
  text_encoder ??= new TextEncoder();
  crypto ??= globalThis.crypto?.subtle?.digest ? globalThis.crypto : (
    // @ts-ignore - we don't install node types in the prod build
    // don't use 'node:crypto' because static analysers will think we rely on node when we don't
    (await import(
      /* @vite-ignore */
      "node:crypto"
    )).webcrypto
  );
  const hash_buffer = await crypto.subtle.digest("SHA-256", text_encoder.encode(data));
  return base64_encode(hash_buffer);
}
function base64_encode(bytes) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
class Renderer {
  /**
   * The contents of the renderer.
   * @type {RendererItem[]}
   */
  #out = [];
  /**
   * Any `onDestroy` callbacks registered during execution of this renderer.
   * @type {(() => void)[] | undefined}
   */
  #on_destroy = void 0;
  /**
   * Whether this renderer is a component body.
   * @type {boolean}
   */
  #is_component_body = false;
  /**
   * The type of string content that this renderer is accumulating.
   * @type {RendererType}
   */
  type;
  /** @type {Renderer | undefined} */
  #parent;
  /**
   * Asynchronous work associated with this renderer
   * @type {Promise<void> | undefined}
   */
  promise = void 0;
  /**
   * State which is associated with the content tree as a whole.
   * It will be re-exposed, uncopied, on all children.
   * @type {SSRState}
   * @readonly
   */
  global;
  /**
   * State that is local to the branch it is declared in.
   * It will be shallow-copied to all children.
   *
   * @type {{ select_value: string | undefined }}
   */
  local;
  /**
   * @param {SSRState} global
   * @param {Renderer | undefined} [parent]
   */
  constructor(global, parent) {
    this.#parent = parent;
    this.global = global;
    this.local = parent ? { ...parent.local } : { select_value: void 0 };
    this.type = parent ? parent.type : "body";
  }
  /**
   * @param {(renderer: Renderer) => void} fn
   */
  head(fn) {
    const head2 = new Renderer(this.global, this);
    head2.type = "head";
    this.#out.push(head2);
    head2.child(fn);
  }
  /**
   * @param {Array<Promise<void>>} blockers
   * @param {(renderer: Renderer) => void} fn
   */
  async_block(blockers, fn) {
    this.#out.push(BLOCK_OPEN);
    this.async(blockers, fn);
    this.#out.push(BLOCK_CLOSE);
  }
  /**
   * @param {Array<Promise<void>>} blockers
   * @param {(renderer: Renderer) => void} fn
   */
  async(blockers, fn) {
    let callback = fn;
    if (blockers.length > 0) {
      const context = ssr_context;
      callback = (renderer) => {
        return Promise.all(blockers).then(() => {
          const previous_context = ssr_context;
          try {
            set_ssr_context(context);
            return fn(renderer);
          } finally {
            set_ssr_context(previous_context);
          }
        });
      };
    }
    this.child(callback);
  }
  /**
   * @param {Array<() => void>} thunks
   */
  run(thunks) {
    const context = ssr_context;
    let promise = Promise.resolve(thunks[0]());
    const promises = [promise];
    for (const fn of thunks.slice(1)) {
      promise = promise.then(() => {
        const previous_context = ssr_context;
        set_ssr_context(context);
        try {
          return fn();
        } finally {
          set_ssr_context(previous_context);
        }
      });
      promises.push(promise);
    }
    promise.catch(noop);
    this.promise = promise;
    return promises;
  }
  /**
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   */
  child_block(fn) {
    this.#out.push(BLOCK_OPEN);
    this.child(fn);
    this.#out.push(BLOCK_CLOSE);
  }
  /**
   * Create a child renderer. The child renderer inherits the state from the parent,
   * but has its own content.
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   */
  child(fn) {
    const child = new Renderer(this.global, this);
    this.#out.push(child);
    const parent = ssr_context;
    set_ssr_context({
      ...ssr_context,
      p: parent,
      c: null,
      r: child
    });
    const result = fn(child);
    set_ssr_context(parent);
    if (result instanceof Promise) {
      if (child.global.mode === "sync") {
        await_invalid();
      }
      result.catch(() => {
      });
      child.promise = result;
    }
    return child;
  }
  /**
   * Create a component renderer. The component renderer inherits the state from the parent,
   * but has its own content. It is treated as an ordering boundary for ondestroy callbacks.
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   * @param {Function} [component_fn]
   * @returns {void}
   */
  component(fn, component_fn) {
    push();
    const child = this.child(fn);
    child.#is_component_body = true;
    pop();
  }
  /**
   * @param {Record<string, any>} attrs
   * @param {(renderer: Renderer) => void} fn
   * @param {string | undefined} [css_hash]
   * @param {Record<string, boolean> | undefined} [classes]
   * @param {Record<string, string> | undefined} [styles]
   * @param {number | undefined} [flags]
   * @param {boolean | undefined} [is_rich]
   * @returns {void}
   */
  select(attrs, fn, css_hash, classes, styles, flags, is_rich) {
    const { value, ...select_attrs } = attrs;
    this.push(`<select${attributes(select_attrs, css_hash, classes, styles, flags)}>`);
    this.child((renderer) => {
      renderer.local.select_value = value;
      fn(renderer);
    });
    this.push(`${is_rich ? "<!>" : ""}</select>`);
  }
  /**
   * @param {Record<string, any>} attrs
   * @param {string | number | boolean | ((renderer: Renderer) => void)} body
   * @param {string | undefined} [css_hash]
   * @param {Record<string, boolean> | undefined} [classes]
   * @param {Record<string, string> | undefined} [styles]
   * @param {number | undefined} [flags]
   * @param {boolean | undefined} [is_rich]
   */
  option(attrs, body, css_hash, classes, styles, flags, is_rich) {
    this.#out.push(`<option${attributes(attrs, css_hash, classes, styles, flags)}`);
    const close = (renderer, value, { head: head2, body: body2 }) => {
      if ("value" in attrs) {
        value = attrs.value;
      }
      if (value === this.local.select_value) {
        renderer.#out.push(" selected");
      }
      renderer.#out.push(`>${body2}${is_rich ? "<!>" : ""}</option>`);
      if (head2) {
        renderer.head((child) => child.push(head2));
      }
    };
    if (typeof body === "function") {
      this.child((renderer) => {
        const r = new Renderer(this.global, this);
        body(r);
        if (this.global.mode === "async") {
          return r.#collect_content_async().then((content) => {
            close(renderer, content.body.replaceAll("<!---->", ""), content);
          });
        } else {
          const content = r.#collect_content();
          close(renderer, content.body.replaceAll("<!---->", ""), content);
        }
      });
    } else {
      close(this, body, { body });
    }
  }
  /**
   * @param {(renderer: Renderer) => void} fn
   */
  title(fn) {
    const path = this.get_path();
    const close = (head2) => {
      this.global.set_title(head2, path);
    };
    this.child((renderer) => {
      const r = new Renderer(renderer.global, renderer);
      fn(r);
      if (renderer.global.mode === "async") {
        return r.#collect_content_async().then((content) => {
          close(content.head);
        });
      } else {
        const content = r.#collect_content();
        close(content.head);
      }
    });
  }
  /**
   * @param {string | (() => Promise<string>)} content
   */
  push(content) {
    if (typeof content === "function") {
      this.child(async (renderer) => renderer.push(await content()));
    } else {
      this.#out.push(content);
    }
  }
  /**
   * @param {() => void} fn
   */
  on_destroy(fn) {
    (this.#on_destroy ??= []).push(fn);
  }
  /**
   * @returns {number[]}
   */
  get_path() {
    return this.#parent ? [...this.#parent.get_path(), this.#parent.#out.indexOf(this)] : [];
  }
  /**
   * @deprecated this is needed for legacy component bindings
   */
  copy() {
    const copy = new Renderer(this.global, this.#parent);
    copy.#out = this.#out.map((item) => item instanceof Renderer ? item.copy() : item);
    copy.promise = this.promise;
    return copy;
  }
  /**
   * @param {Renderer} other
   * @deprecated this is needed for legacy component bindings
   */
  subsume(other) {
    if (this.global.mode !== other.global.mode) {
      throw new Error(
        "invariant: A renderer cannot switch modes. If you're seeing this, there's a compiler bug. File an issue!"
      );
    }
    this.local = other.local;
    this.#out = other.#out.map((item) => {
      if (item instanceof Renderer) {
        item.subsume(item);
      }
      return item;
    });
    this.promise = other.promise;
    this.type = other.type;
  }
  get length() {
    return this.#out.length;
  }
  /**
   * Only available on the server and when compiling with the `server` option.
   * Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} [options]
   * @returns {RenderOutput}
   */
  static render(component, options = {}) {
    let sync;
    const result = (
      /** @type {RenderOutput} */
      {}
    );
    Object.defineProperties(result, {
      html: {
        get: () => {
          return (sync ??= Renderer.#render(component, options)).body;
        }
      },
      head: {
        get: () => {
          return (sync ??= Renderer.#render(component, options)).head;
        }
      },
      body: {
        get: () => {
          return (sync ??= Renderer.#render(component, options)).body;
        }
      },
      hashes: {
        value: {
          script: ""
        }
      },
      then: {
        value: (
          /**
           * this is not type-safe, but honestly it's the best I can do right now, and it's a straightforward function.
           *
           * @template TResult1
           * @template [TResult2=never]
           * @param { (value: SyncRenderOutput) => TResult1 } onfulfilled
           * @param { (reason: unknown) => TResult2 } onrejected
           */
          (onfulfilled, onrejected) => {
            {
              const result2 = sync ??= Renderer.#render(component, options);
              const user_result = onfulfilled({
                head: result2.head,
                body: result2.body,
                html: result2.body,
                hashes: { script: [] }
              });
              return Promise.resolve(user_result);
            }
          }
        )
      }
    });
    return result;
  }
  /**
   * Collect all of the `onDestroy` callbacks registered during rendering. In an async context, this is only safe to call
   * after awaiting `collect_async`.
   *
   * Child renderers are "porous" and don't affect execution order, but component body renderers
   * create ordering boundaries. Within a renderer, callbacks run in order until hitting a component boundary.
   * @returns {Iterable<() => void>}
   */
  *#collect_on_destroy() {
    for (const component of this.#traverse_components()) {
      yield* component.#collect_ondestroy();
    }
  }
  /**
   * Performs a depth-first search of renderers, yielding the deepest components first, then additional components as we backtrack up the tree.
   * @returns {Iterable<Renderer>}
   */
  *#traverse_components() {
    for (const child of this.#out) {
      if (typeof child !== "string") {
        yield* child.#traverse_components();
      }
    }
    if (this.#is_component_body) {
      yield this;
    }
  }
  /**
   * @returns {Iterable<() => void>}
   */
  *#collect_ondestroy() {
    if (this.#on_destroy) {
      for (const fn of this.#on_destroy) {
        yield fn;
      }
    }
    for (const child of this.#out) {
      if (child instanceof Renderer && !child.#is_component_body) {
        yield* child.#collect_ondestroy();
      }
    }
  }
  /**
   * Render a component. Throws if any of the children are performing asynchronous work.
   *
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string }} options
   * @returns {AccumulatedContent}
   */
  static #render(component, options) {
    var previous_context = ssr_context;
    try {
      const renderer = Renderer.#open_render("sync", component, options);
      const content = renderer.#collect_content();
      return Renderer.#close_render(content, renderer);
    } finally {
      abort();
      set_ssr_context(previous_context);
    }
  }
  /**
   * Render a component.
   *
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} options
   * @returns {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }>}
   */
  static async #render_async(component, options) {
    const previous_context = ssr_context;
    try {
      const renderer = Renderer.#open_render("async", component, options);
      const content = await renderer.#collect_content_async();
      const hydratables = await renderer.#collect_hydratables();
      if (hydratables !== null) {
        content.head = hydratables + content.head;
      }
      return Renderer.#close_render(content, renderer);
    } finally {
      set_ssr_context(previous_context);
      abort();
    }
  }
  /**
   * Collect all of the code from the `out` array and return it as a string, or a promise resolving to a string.
   * @param {AccumulatedContent} content
   * @returns {AccumulatedContent}
   */
  #collect_content(content = { head: "", body: "" }) {
    for (const item of this.#out) {
      if (typeof item === "string") {
        content[this.type] += item;
      } else if (item instanceof Renderer) {
        item.#collect_content(content);
      }
    }
    return content;
  }
  /**
   * Collect all of the code from the `out` array and return it as a string.
   * @param {AccumulatedContent} content
   * @returns {Promise<AccumulatedContent>}
   */
  async #collect_content_async(content = { head: "", body: "" }) {
    await this.promise;
    for (const item of this.#out) {
      if (typeof item === "string") {
        content[this.type] += item;
      } else if (item instanceof Renderer) {
        await item.#collect_content_async(content);
      }
    }
    return content;
  }
  async #collect_hydratables() {
    const ctx = get_render_context().hydratable;
    for (const [_, key] of ctx.unresolved_promises) {
      unresolved_hydratable(key, ctx.lookup.get(key)?.stack ?? "<missing stack trace>");
    }
    for (const comparison of ctx.comparisons) {
      await comparison;
    }
    return await this.#hydratable_block(ctx);
  }
  /**
   * @template {Record<string, any>} Props
   * @param {'sync' | 'async'} mode
   * @param {import('svelte').Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} options
   * @returns {Renderer}
   */
  static #open_render(mode, component, options) {
    const renderer = new Renderer(
      new SSRState(mode, options.idPrefix ? options.idPrefix + "-" : "", options.csp)
    );
    renderer.push(BLOCK_OPEN);
    push();
    if (options.context) ssr_context.c = options.context;
    ssr_context.r = renderer;
    component(renderer, options.props ?? {});
    pop();
    renderer.push(BLOCK_CLOSE);
    return renderer;
  }
  /**
   * @param {AccumulatedContent} content
   * @param {Renderer} renderer
   * @returns {AccumulatedContent & { hashes: { script: Sha256Source[] } }}
   */
  static #close_render(content, renderer) {
    for (const cleanup of renderer.#collect_on_destroy()) {
      cleanup();
    }
    let head2 = content.head + renderer.global.get_title();
    let body = content.body;
    for (const { hash, code } of renderer.global.css) {
      head2 += `<style id="${hash}">${code}</style>`;
    }
    return {
      head: head2,
      body,
      hashes: {
        script: renderer.global.csp.script_hashes
      }
    };
  }
  /**
   * @param {HydratableContext} ctx
   */
  async #hydratable_block(ctx) {
    if (ctx.lookup.size === 0) {
      return null;
    }
    let entries = [];
    let has_promises = false;
    for (const [k, v] of ctx.lookup) {
      if (v.promises) {
        has_promises = true;
        for (const p of v.promises) await p;
      }
      entries.push(`[${devalue.uneval(k)},${v.serialized}]`);
    }
    let prelude = `const h = (window.__svelte ??= {}).h ??= new Map();`;
    if (has_promises) {
      prelude = `const r = (v) => Promise.resolve(v);
				${prelude}`;
    }
    const body = `
			{
				${prelude}

				for (const [k, v] of [
					${entries.join(",\n					")}
				]) {
					h.set(k, v);
				}
			}
		`;
    let csp_attr = "";
    if (this.global.csp.nonce) {
      csp_attr = ` nonce="${this.global.csp.nonce}"`;
    } else if (this.global.csp.hash) {
      const hash = await sha256(body);
      this.global.csp.script_hashes.push(`sha256-${hash}`);
    }
    return `
		<script${csp_attr}>${body}<\/script>`;
  }
}
class SSRState {
  /** @readonly @type {Csp & { script_hashes: Sha256Source[] }} */
  csp;
  /** @readonly @type {'sync' | 'async'} */
  mode;
  /** @readonly @type {() => string} */
  uid;
  /** @readonly @type {Set<{ hash: string; code: string }>} */
  css = /* @__PURE__ */ new Set();
  /** @type {{ path: number[], value: string }} */
  #title = { path: [], value: "" };
  /**
   * @param {'sync' | 'async'} mode
   * @param {string} id_prefix
   * @param {Csp} csp
   */
  constructor(mode, id_prefix = "", csp = { hash: false }) {
    this.mode = mode;
    this.csp = { ...csp, script_hashes: [] };
    let uid = 1;
    this.uid = () => `${id_prefix}s${uid++}`;
  }
  get_title() {
    return this.#title.value;
  }
  /**
   * Performs a depth-first (lexicographic) comparison using the path. Rejects sets
   * from earlier than or equal to the current value.
   * @param {string} value
   * @param {number[]} path
   */
  set_title(value, path) {
    const current = this.#title.path;
    let i = 0;
    let l = Math.min(path.length, current.length);
    while (i < l && path[i] === current[i]) i += 1;
    if (path[i] === void 0) return;
    if (current[i] === void 0 || path[i] > current[i]) {
      this.#title.path = path;
      this.#title.value = value;
    }
  }
}
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function element(renderer, tag, attributes_fn = noop, children_fn = noop) {
  renderer.push("<!---->");
  if (tag) {
    renderer.push(`<${tag}`);
    attributes_fn();
    renderer.push(`>`);
    if (!is_void(tag)) {
      children_fn();
      if (!is_raw_text_element(tag)) {
        renderer.push(EMPTY_COMMENT);
      }
      renderer.push(`</${tag}>`);
    }
  }
  renderer.push("<!---->");
}
function render(component, options = {}) {
  if (options.csp?.hash && options.csp.nonce) {
    invalid_csp();
  }
  return Renderer.render(
    /** @type {Component<Props>} */
    component,
    options
  );
}
function head(hash, renderer, fn) {
  renderer.head((renderer2) => {
    renderer2.push(`<!--${hash}-->`);
    renderer2.child(fn);
    renderer2.push(EMPTY_COMMENT);
  });
}
function attributes(attrs, css_hash, classes, styles, flags = 0) {
  if (styles) {
    attrs.style = to_style(attrs.style, styles);
  }
  if (attrs.class) {
    attrs.class = clsx(attrs.class);
  }
  if (css_hash || classes) {
    attrs.class = to_class(attrs.class, css_hash, classes);
  }
  let attr_str = "";
  let name;
  const is_html = (flags & ELEMENT_IS_NAMESPACED) === 0;
  const lowercase = (flags & ELEMENT_PRESERVE_ATTRIBUTE_CASE) === 0;
  const is_input = (flags & ELEMENT_IS_INPUT) !== 0;
  for (name in attrs) {
    if (typeof attrs[name] === "function") continue;
    if (name[0] === "$" && name[1] === "$") continue;
    if (INVALID_ATTR_NAME_CHAR_REGEX.test(name)) continue;
    var value = attrs[name];
    if (lowercase) {
      name = name.toLowerCase();
    }
    if (is_input) {
      if (name === "defaultvalue" || name === "defaultchecked") {
        name = name === "defaultvalue" ? "value" : "checked";
        if (attrs[name]) continue;
      }
    }
    attr_str += attr(name, value, is_html && is_boolean_attribute(name));
  }
  return attr_str;
}
function spread_props(props) {
  const merged_props = {};
  let key;
  for (let i = 0; i < props.length; i++) {
    const obj = props[i];
    for (key in obj) {
      const desc = Object.getOwnPropertyDescriptor(obj, key);
      if (desc) {
        Object.defineProperty(merged_props, key, desc);
      } else {
        merged_props[key] = obj[key];
      }
    }
  }
  return merged_props;
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function store_get(store_values, store_name, store) {
  if (store_name in store_values && store_values[store_name][0] === store) {
    return store_values[store_name][2];
  }
  store_values[store_name]?.[1]();
  store_values[store_name] = [store, null, void 0];
  const unsub = subscribe_to_store(
    store,
    /** @param {any} v */
    (v) => store_values[store_name][2] = v
  );
  store_values[store_name][1] = unsub;
  return store_values[store_name][2];
}
function unsubscribe_stores(store_values) {
  for (const store_name in store_values) {
    store_values[store_name][1]();
  }
}
function slot(renderer, $$props, name, slot_props, fallback_fn) {
  var slot_fn = $$props.$$slots?.[name];
  if (slot_fn === true) {
    slot_fn = $$props["children"];
  }
  if (slot_fn !== void 0) {
    slot_fn(renderer, slot_props);
  }
}
function rest_props(props, rest) {
  const rest_props2 = {};
  let key;
  for (key in props) {
    if (!rest.includes(key)) {
      rest_props2[key] = props[key];
    }
  }
  return rest_props2;
}
function sanitize_props(props) {
  const { children, $$slots, ...sanitized } = props;
  return sanitized;
}
function bind_props(props_parent, props_now) {
  for (const key in props_now) {
    const initial_value = props_parent[key];
    const value = props_now[key];
    if (initial_value === void 0 && value !== void 0 && Object.getOwnPropertyDescriptor(props_parent, key)?.set) {
      props_parent[key] = value;
    }
  }
}
function ensure_array_like(array_like_or_iterator) {
  if (array_like_or_iterator) {
    return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  return [];
}
const h = (component, propsOrChildren, childrenOrKey, key = null) => {
  const hasProps = typeof propsOrChildren === "object" && propsOrChildren !== null && !Array.isArray(propsOrChildren);
  return {
    component,
    key: hasProps ? key : typeof childrenOrKey === "number" ? childrenOrKey : null,
    props: hasProps ? propsOrChildren : {},
    children: hasProps ? Array.isArray(childrenOrKey) ? childrenOrKey : childrenOrKey !== null ? [childrenOrKey] : [] : Array.isArray(propsOrChildren) ? propsOrChildren : propsOrChildren !== null ? [propsOrChildren] : []
  };
};
function Render($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let component = $$props["component"];
    let props = fallback($$props["props"], () => ({}), true);
    let children = fallback($$props["children"], () => [], true);
    let key = fallback($$props["key"], null);
    if (component) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!---->`);
      {
        if (children.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push("<!---->");
          component?.($$renderer2, spread_props([
            props,
            {
              children: ($$renderer3) => {
                $$renderer3.push(`<!--[-->`);
                const each_array = ensure_array_like(children);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let child = each_array[$$index];
                  Render($$renderer3, spread_props([child]));
                  $$renderer3.push(`<!---->`);
                }
                $$renderer3.push(`<!--]-->`);
              },
              $$slots: { default: true }
            }
          ]));
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push("<!---->");
          component?.($$renderer2, spread_props([props]));
          $$renderer2.push(`<!---->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { component, props, children, key });
  });
}
const { set, subscribe } = writable();
const setPage = set;
const page = { subscribe };
function App$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let initialComponent = $$props["initialComponent"];
    let initialPage = $$props["initialPage"];
    let resolveComponent = $$props["resolveComponent"];
    let component = initialComponent;
    let key = null;
    let page2 = { ...initialPage, flash: initialPage.flash ?? {} };
    let renderProps = resolveRenderProps(component, page2, key);
    setPage(page2);
    const isServer = typeof window === "undefined";
    if (!isServer) {
      router.init({
        initialPage,
        resolveComponent,
        swapComponent: async (args) => {
          component = args.component;
          page2 = args.page;
          key = args.preserveState ? key : Date.now();
          renderProps = resolveRenderProps(component, page2, key);
          setPage(page2);
        },
        onFlash: (flash) => {
          page2 = { ...page2, flash };
          setPage(page2);
        }
      });
    }
    function resolveRenderProps(component2, page22, key2 = null) {
      const child = h(component2.default, page22.props, [], key2);
      const layout = component2.layout;
      return layout ? resolveLayout(layout, child, page22.props, key2) : child;
    }
    function resolveLayout(layout, child, pageProps, key2) {
      if (isLayoutFunction(layout)) {
        return layout(h, child);
      }
      if (Array.isArray(layout)) {
        return layout.slice().reverse().reduce((currentRender, layoutComponent) => h(layoutComponent, pageProps, [currentRender], key2), child);
      }
      return h(layout, pageProps, child ? [child] : [], key2);
    }
    function isLayoutFunction(layout) {
      return typeof layout === "function" && layout.length === 2 && typeof layout.prototype === "undefined";
    }
    Render($$renderer2, spread_props([renderProps]));
    bind_props($$props, { initialComponent, initialPage, resolveComponent });
  });
}
const FormContextKey = /* @__PURE__ */ Symbol("InertiaFormContext");
let reservedFormKeys = null;
let bootstrapping = false;
function validateFormDataKeys(data) {
  if (bootstrapping) {
    return;
  }
  if (reservedFormKeys === null) {
    bootstrapping = true;
    const store = useForm({});
    reservedFormKeys = new Set(Object.keys(get(store)));
    bootstrapping = false;
  }
  const conflicts = Object.keys(data).filter((key) => reservedFormKeys.has(key));
  if (conflicts.length > 0) {
    console.error(`[Inertia] useForm() data contains field(s) that conflict with form properties: ${conflicts.map((k) => `"${k}"`).join(", ")}. These fields will be overwritten by form methods/properties. Please rename these fields.`);
  }
}
function useForm(...args) {
  const parsedArgs = UseFormUtils.parseUseFormArguments(...args);
  const { rememberKey, data: initialData } = parsedArgs;
  let precognitionEndpoint = parsedArgs.precognitionEndpoint;
  const data = typeof initialData === "function" ? initialData() : initialData;
  const restored = rememberKey ? router.restore(rememberKey) : null;
  let defaults = cloneDeep(data);
  validateFormDataKeys(defaults);
  let cancelToken = null;
  let recentlySuccessfulTimeoutId = null;
  let transform = (data2) => data2;
  let rememberExcludeKeys = [];
  let defaultsCalledInOnSuccess = false;
  let validatorRef = null;
  let setFormState;
  const withPrecognition = (...args2) => {
    precognitionEndpoint = UseFormUtils.createWayfinderCallback(...args2);
    const formWithPrecognition = () => get(store);
    let withAllErrors = false;
    if (!validatorRef) {
      const validator = createValidator((client) => {
        const { method, url } = precognitionEndpoint();
        const form = formWithPrecognition();
        const transformedData = cloneDeep(transform(form.data()));
        return client[method](url, transformedData);
      }, cloneDeep(defaults));
      validatorRef = validator;
      validator.on("validatingChanged", () => {
        setFormState("validating", validator.validating());
      }).on("validatedChanged", () => {
        setFormState("__valid", validator.valid());
      }).on("touchedChanged", () => {
        setFormState("__touched", validator.touched());
      }).on("errorsChanged", () => {
        const validationErrors = withAllErrors ? validator.errors() : toSimpleValidationErrors(validator.errors());
        setFormState("errors", {});
        formWithPrecognition().setError(validationErrors);
        setFormState("__valid", validator.valid());
      });
    }
    const tap = (value, callback) => {
      callback(value);
      return value;
    };
    if (validatorRef) {
      Object.assign(store, {});
    }
    store.update((form) => {
      return Object.assign(store, {
        ...form,
        __touched: [],
        __valid: [],
        validating: false,
        validator: () => validatorRef,
        validate: (field, config2) => {
          const form2 = formWithPrecognition();
          if (typeof field === "object" && !("target" in field)) {
            config2 = field;
            field = void 0;
          }
          if (field === void 0) {
            validatorRef.validate(config2);
          } else {
            field = resolveName(field);
            const transformedData = transform(form2.data());
            validatorRef.validate(field, get$1(transformedData, field), config2);
          }
          return form2;
        },
        touch: (field, ...fields) => {
          const form2 = formWithPrecognition();
          if (Array.isArray(field)) {
            validatorRef?.touch(field);
          } else if (typeof field === "string") {
            validatorRef?.touch([field, ...fields]);
          } else {
            validatorRef?.touch(field);
          }
          return form2;
        },
        validateFiles: () => tap(formWithPrecognition(), () => validatorRef?.validateFiles()),
        setValidationTimeout: (duration) => tap(formWithPrecognition(), () => validatorRef.setTimeout(duration)),
        withAllErrors: () => tap(formWithPrecognition(), () => withAllErrors = true),
        withoutFileValidation: () => tap(formWithPrecognition(), () => validatorRef?.withoutFileValidation()),
        valid: (field) => formWithPrecognition().__valid.includes(field),
        invalid: (field) => field in formWithPrecognition().errors,
        touched: (field) => {
          const touched = formWithPrecognition().__touched;
          return typeof field === "string" ? touched.includes(field) : touched.length > 0;
        },
        setErrors: (errors) => tap(formWithPrecognition(), () => {
          const form2 = formWithPrecognition();
          form2.setError(errors);
        }),
        forgetError: (field) => tap(formWithPrecognition(), () => {
          const form2 = formWithPrecognition();
          form2.clearErrors(resolveName(field));
        })
      });
    });
    return store;
  };
  const store = writable({
    ...restored ? restored.data : data,
    isDirty: false,
    errors: restored ? restored.errors : {},
    hasErrors: false,
    progress: null,
    wasSuccessful: false,
    recentlySuccessful: false,
    processing: false,
    setStore(keyOrData, maybeValue = void 0) {
      store.update((store2) => {
        return typeof keyOrData === "string" ? set$1(store2, keyOrData, maybeValue) : Object.assign(store2, keyOrData);
      });
    },
    data() {
      return Object.keys(data).reduce((carry, key) => {
        return set$1(carry, key, get$1(this, key));
      }, {});
    },
    transform(callback) {
      transform = callback;
      return this;
    },
    defaults(fieldOrFields, maybeValue) {
      defaultsCalledInOnSuccess = true;
      if (typeof fieldOrFields === "undefined") {
        defaults = cloneDeep(this.data());
      } else {
        defaults = typeof fieldOrFields === "string" ? set$1(cloneDeep(defaults), fieldOrFields, maybeValue) : Object.assign(cloneDeep(defaults), fieldOrFields);
      }
      validatorRef?.defaults(defaults);
      return this;
    },
    reset(...fields) {
      const clonedData = cloneDeep(defaults);
      if (fields.length === 0) {
        this.setStore(clonedData);
      } else {
        this.setStore(fields.filter((key) => has(clonedData, key)).reduce((carry, key) => {
          return set$1(carry, key, get$1(clonedData, key));
        }, {}));
      }
      validatorRef?.reset(...fields);
      return this;
    },
    setError(fieldOrFields, maybeValue) {
      const errors = typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields;
      setFormState("errors", {
        ...this.errors,
        ...errors
      });
      validatorRef?.setErrors(errors);
      return this;
    },
    clearErrors(...fields) {
      setFormState("errors", Object.keys(this.errors).reduce((carry, field) => ({
        ...carry,
        ...fields.length > 0 && !fields.includes(field) ? { [field]: this.errors[field] } : {}
      }), {}));
      if (validatorRef) {
        if (fields.length === 0) {
          validatorRef.setErrors({});
        } else {
          fields.forEach(validatorRef.forgetError);
        }
      }
      return this;
    },
    resetAndClearErrors(...fields) {
      this.reset(...fields);
      this.clearErrors(...fields);
      return this;
    },
    submit(...args2) {
      const { method, url, options } = UseFormUtils.parseSubmitArguments(args2, precognitionEndpoint);
      defaultsCalledInOnSuccess = false;
      const data2 = transform(this.data());
      const _options = {
        ...options,
        onCancelToken: (token) => {
          cancelToken = token;
          if (options.onCancelToken) {
            return options.onCancelToken(token);
          }
        },
        onBefore: (visit) => {
          setFormState("wasSuccessful", false);
          setFormState("recentlySuccessful", false);
          if (recentlySuccessfulTimeoutId) {
            clearTimeout(recentlySuccessfulTimeoutId);
          }
          if (options.onBefore) {
            return options.onBefore(visit);
          }
        },
        onStart: (visit) => {
          setFormState("processing", true);
          if (options.onStart) {
            return options.onStart(visit);
          }
        },
        onProgress: (event) => {
          setFormState("progress", event || null);
          if (options.onProgress) {
            return options.onProgress(event);
          }
        },
        onSuccess: async (page2) => {
          setFormState("processing", false);
          setFormState("progress", null);
          this.clearErrors();
          setFormState("wasSuccessful", true);
          setFormState("recentlySuccessful", true);
          recentlySuccessfulTimeoutId = setTimeout(() => setFormState("recentlySuccessful", false), config.get("form.recentlySuccessfulDuration"));
          const onSuccess = options.onSuccess ? await options.onSuccess(page2) : null;
          if (!defaultsCalledInOnSuccess) {
            this.defaults(cloneDeep(get(store).data()));
          }
          return onSuccess;
        },
        onError: (errors) => {
          setFormState("processing", false);
          setFormState("progress", null);
          setFormState("errors", errors);
          validatorRef?.setErrors(errors);
          if (options.onError) {
            return options.onError(errors);
          }
        },
        onCancel: () => {
          setFormState("processing", false);
          setFormState("progress", null);
          if (options.onCancel) {
            return options.onCancel();
          }
        },
        onFinish: (visit) => {
          setFormState("processing", false);
          setFormState("progress", null);
          cancelToken = null;
          if (options.onFinish) {
            return options.onFinish(visit);
          }
        }
      };
      if (method === "delete") {
        router.delete(url, { ..._options, data: data2 });
      } else {
        router[method](url, data2, _options);
      }
    },
    get(url, options) {
      this.submit("get", url, options);
    },
    post(url, options) {
      this.submit("post", url, options);
    },
    put(url, options) {
      this.submit("put", url, options);
    },
    patch(url, options) {
      this.submit("patch", url, options);
    },
    delete(url, options) {
      this.submit("delete", url, options);
    },
    cancel() {
      cancelToken?.cancel();
    },
    __remember() {
      const data2 = this.data();
      if (rememberExcludeKeys.length > 0) {
        const filtered = { ...data2 };
        rememberExcludeKeys.forEach((k) => delete filtered[k]);
        return { data: filtered, errors: this.errors };
      }
      return { data: data2, errors: this.errors };
    },
    withPrecognition
  });
  const dontRememberMethod = (...keys) => {
    rememberExcludeKeys = keys;
    return store;
  };
  Object.assign(store, {
    withPrecognition,
    dontRemember: dontRememberMethod
  });
  setFormState = (key, value) => {
    store.update((form) => ({ ...form, [key]: value }));
  };
  store.subscribe((form) => {
    if (form.isDirty === isEqual(form.data(), defaults)) {
      setFormState("isDirty", !form.isDirty);
    }
    const hasErrors = Object.keys(form.errors).length > 0;
    if (form.hasErrors !== hasErrors) {
      setFormState("hasErrors", !form.hasErrors);
    }
    if (rememberKey) {
      const storedData = router.restore(rememberKey);
      const newData = form.__remember();
      if (!isEqual(storedData, newData)) {
        router.remember(newData, rememberKey);
      }
    }
  });
  return precognitionEndpoint ? store.withPrecognition(precognitionEndpoint) : store;
}
function Form($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "getFormData",
    "getData",
    "submit",
    "reset",
    "clearErrors",
    "resetAndClearErrors",
    "setError",
    "defaults",
    "validate",
    "valid",
    "invalid",
    "touch",
    "touched",
    "validator",
    "action",
    "method",
    "headers",
    "queryStringArrayFormat",
    "errorBag",
    "showProgress",
    "transform",
    "options",
    "onCancelToken",
    "onBefore",
    "onStart",
    "onProgress",
    "onFinish",
    "onCancel",
    "onSuccess",
    "onError",
    "onSubmitComplete",
    "disableWhileProcessing",
    "invalidateCacheTags",
    "resetOnError",
    "resetOnSuccess",
    "setDefaultsOnSuccess",
    "validateFiles",
    "validationTimeout",
    "withAllErrors"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let _method, _action, slotErrors;
    const noop$1 = () => void 0;
    let action = fallback($$props["action"], "");
    let method = fallback($$props["method"], "get");
    let headers = fallback($$props["headers"], () => ({}), true);
    let queryStringArrayFormat = fallback($$props["queryStringArrayFormat"], "brackets");
    let errorBag = fallback($$props["errorBag"], null);
    let showProgress = fallback($$props["showProgress"], true);
    let transform = fallback($$props["transform"], (data) => data);
    let options = fallback($$props["options"], () => ({}), true);
    let onCancelToken = fallback($$props["onCancelToken"], noop$1);
    let onBefore = fallback($$props["onBefore"], noop$1);
    let onStart = fallback($$props["onStart"], noop$1);
    let onProgress = fallback($$props["onProgress"], noop$1);
    let onFinish = fallback($$props["onFinish"], noop$1);
    let onCancel = fallback($$props["onCancel"], noop$1);
    let onSuccess = fallback($$props["onSuccess"], noop$1);
    let onError = fallback($$props["onError"], noop$1);
    let onSubmitComplete = fallback($$props["onSubmitComplete"], noop$1);
    let disableWhileProcessing = fallback($$props["disableWhileProcessing"], false);
    let invalidateCacheTags = fallback($$props["invalidateCacheTags"], () => [], true);
    let resetOnError = fallback($$props["resetOnError"], false);
    let resetOnSuccess = fallback($$props["resetOnSuccess"], false);
    let setDefaultsOnSuccess = fallback($$props["setDefaultsOnSuccess"], false);
    let validateFiles = fallback($$props["validateFiles"], false);
    let validationTimeout = fallback($$props["validationTimeout"], 1500);
    let withAllErrors = fallback($$props["withAllErrors"], false);
    const getTransformedData = () => {
      const [_url, data] = getUrlAndData();
      return transform(data);
    };
    const form = useForm({}).withPrecognition(() => _method, () => getUrlAndData()[0]).setValidationTimeout(validationTimeout);
    if (validateFiles) {
      form.validateFiles();
    }
    if (withAllErrors) {
      form.withAllErrors();
    }
    form.transform(getTransformedData);
    let formElement;
    let isDirty = false;
    let defaultData = new FormData();
    function getFormData(submitter) {
      return new FormData(formElement, submitter);
    }
    function getData(submitter) {
      return formDataToObject(getFormData(submitter));
    }
    function getUrlAndData(submitter) {
      return mergeDataIntoQueryString(_method, _action, getData(submitter), queryStringArrayFormat);
    }
    function submit(submitter) {
      const [url, data] = getUrlAndData(submitter);
      const formTarget = submitter?.getAttribute("formtarget");
      if (formTarget === "_blank" && _method === "get") {
        window.open(url, "_blank");
        return;
      }
      const maybeReset = (resetOption) => {
        if (!resetOption) {
          return;
        }
        if (resetOption === true) {
          reset();
        } else if (resetOption.length > 0) {
          reset(...resetOption);
        }
      };
      const submitOptions = {
        headers,
        queryStringArrayFormat,
        errorBag,
        showProgress,
        invalidateCacheTags,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess: (...args) => {
          if (onSuccess) {
            onSuccess(...args);
          }
          if (onSubmitComplete) {
            onSubmitComplete({ reset, defaults });
          }
          maybeReset(resetOnSuccess);
          if (setDefaultsOnSuccess === true) {
            defaults();
          }
        },
        onError: (...args) => {
          if (onError) {
            onError(...args);
          }
          maybeReset(resetOnError);
        },
        ...options
      };
      store_get($$store_subs ??= {}, "$form", form).transform(() => transform(data)).submit(_method, url, submitOptions);
      store_get($$store_subs ??= {}, "$form", form).transform(getTransformedData);
    }
    function reset(...fields) {
      resetFormFields(formElement, defaultData, fields);
      form.reset(...fields);
    }
    function clearErrors(...fields) {
      store_get($$store_subs ??= {}, "$form", form).clearErrors(...fields);
    }
    function resetAndClearErrors(...fields) {
      clearErrors(...fields);
      reset(...fields);
    }
    function setError(fieldOrFields, maybeValue) {
      store_get($$store_subs ??= {}, "$form", form).setError(typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields);
    }
    function defaults() {
      defaultData = getFormData();
      isDirty = false;
    }
    function validate(field, config2) {
      return form.validate(...UseFormUtils.mergeHeadersForValidation(field, config2, headers));
    }
    function valid(field) {
      return form.valid(field);
    }
    function invalid(field) {
      return form.invalid(field);
    }
    function touch(field, ...fields) {
      return form.touch(field, ...fields);
    }
    function touched(field) {
      return form.touched(field);
    }
    function validator() {
      return form.validator();
    }
    const formContextStore = writable(void 0);
    setContext(FormContextKey, formContextStore);
    _method = isUrlMethodPair(action) ? action.method : (method ?? "get").toLowerCase();
    _action = isUrlMethodPair(action) ? action.url : action;
    {
      form.setValidationTimeout(validationTimeout);
      if (validateFiles) {
        form.validateFiles();
      } else {
        form.withoutFileValidation();
      }
    }
    slotErrors = store_get($$store_subs ??= {}, "$form", form).errors;
    formContextStore.set({
      errors: store_get($$store_subs ??= {}, "$form", form).errors,
      hasErrors: store_get($$store_subs ??= {}, "$form", form).hasErrors,
      processing: store_get($$store_subs ??= {}, "$form", form).processing,
      progress: store_get($$store_subs ??= {}, "$form", form).progress,
      wasSuccessful: store_get($$store_subs ??= {}, "$form", form).wasSuccessful,
      recentlySuccessful: store_get($$store_subs ??= {}, "$form", form).recentlySuccessful,
      isDirty,
      clearErrors,
      resetAndClearErrors,
      setError,
      reset,
      submit,
      defaults,
      getData,
      getFormData,
      // Precognition
      validator,
      validate,
      touch,
      validating: store_get($$store_subs ??= {}, "$form", form).validating,
      valid,
      invalid,
      touched
    });
    $$renderer2.push(`<form${attributes({
      action: _action,
      method: _method,
      ...$$restProps,
      inert: disableWhileProcessing && store_get($$store_subs ??= {}, "$form", form).processing ? true : void 0
    })}><!--[-->`);
    slot(
      $$renderer2,
      $$props,
      "default",
      {
        errors: slotErrors,
        hasErrors: store_get($$store_subs ??= {}, "$form", form).hasErrors,
        processing: store_get($$store_subs ??= {}, "$form", form).processing,
        progress: store_get($$store_subs ??= {}, "$form", form).progress,
        wasSuccessful: store_get($$store_subs ??= {}, "$form", form).wasSuccessful,
        recentlySuccessful: store_get($$store_subs ??= {}, "$form", form).recentlySuccessful,
        clearErrors,
        resetAndClearErrors,
        setError,
        isDirty,
        submit,
        defaults,
        reset,
        getData,
        getFormData,
        validator,
        validate,
        touch,
        validating: store_get($$store_subs ??= {}, "$form", form).validating,
        valid: store_get($$store_subs ??= {}, "$form", form).valid,
        invalid: store_get($$store_subs ??= {}, "$form", form).invalid,
        touched: store_get($$store_subs ??= {}, "$form", form).touched
      }
    );
    $$renderer2.push(`<!--]--></form>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      action,
      method,
      headers,
      queryStringArrayFormat,
      errorBag,
      showProgress,
      transform,
      options,
      onCancelToken,
      onBefore,
      onStart,
      onProgress,
      onFinish,
      onCancel,
      onSuccess,
      onError,
      onSubmitComplete,
      disableWhileProcessing,
      invalidateCacheTags,
      resetOnError,
      resetOnSuccess,
      setDefaultsOnSuccess,
      validateFiles,
      validationTimeout,
      withAllErrors,
      getFormData,
      getData,
      submit,
      reset,
      clearErrors,
      resetAndClearErrors,
      setError,
      defaults,
      validate,
      valid,
      invalid,
      touch,
      touched,
      validator
    });
  });
}
function Link($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "href",
    "as",
    "data",
    "method",
    "replace",
    "preserveScroll",
    "preserveState",
    "preserveUrl",
    "only",
    "except",
    "headers",
    "queryStringArrayFormat",
    "async",
    "prefetch",
    "cacheFor",
    "cacheTags",
    "viewTransition"
  ]);
  $$renderer.component(($$renderer2) => {
    let _method, _href, asProp, elProps;
    let href = fallback($$props["href"], "");
    let as = fallback($$props["as"], "a");
    let data = fallback($$props["data"], () => ({}), true);
    let method = fallback($$props["method"], "get");
    let replace = fallback($$props["replace"], false);
    let preserveScroll = fallback($$props["preserveScroll"], false);
    let preserveState = fallback($$props["preserveState"], null);
    let preserveUrl = fallback($$props["preserveUrl"], false);
    let only = fallback($$props["only"], () => [], true);
    let except = fallback($$props["except"], () => [], true);
    let headers = fallback($$props["headers"], () => ({}), true);
    let queryStringArrayFormat = fallback($$props["queryStringArrayFormat"], "brackets");
    let async = fallback($$props["async"], false);
    let prefetch = fallback($$props["prefetch"], false);
    let cacheFor = fallback($$props["cacheFor"], 0);
    let cacheTags = fallback($$props["cacheTags"], () => [], true);
    let viewTransition = fallback($$props["viewTransition"], false);
    _method = isUrlMethodPair(href) ? href.method : method;
    _href = isUrlMethodPair(href) ? href.url : href;
    asProp = _method !== "get" ? "button" : as.toLowerCase();
    elProps = { a: { href: _href }, button: { type: "button" } }[asProp] || {};
    element(
      $$renderer2,
      asProp,
      () => {
        $$renderer2.push(`${attributes({ ...$$restProps, ...elProps })}`);
      },
      () => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      }
    );
    bind_props($$props, {
      href,
      as,
      data,
      method,
      replace,
      preserveScroll,
      preserveState,
      preserveUrl,
      only,
      except,
      headers,
      queryStringArrayFormat,
      async,
      prefetch,
      cacheFor,
      cacheTags,
      viewTransition
    });
  });
}
async function createInertiaApp({ id = "app", resolve, setup, progress = {}, page: page2, defaults = {} }) {
  config.replace(defaults);
  const isServer = typeof window === "undefined";
  const useScriptElementForInitialPage = config.get("future.useScriptElementForInitialPage");
  const initialPage = page2 || getInitialPageFromDOM(id, useScriptElementForInitialPage);
  const resolveComponent = (name) => Promise.resolve(resolve(name));
  const svelteApp = await Promise.all([
    resolveComponent(initialPage.component),
    router.decryptHistory().catch(() => {
    })
  ]).then(([initialComponent]) => {
    return setup({
      el: isServer ? null : document.getElementById(id),
      App: App$1,
      props: { initialPage, initialComponent, resolveComponent }
    });
  });
  if (isServer && svelteApp) {
    const { html: html2, head: head2, css } = svelteApp;
    return {
      body: useScriptElementForInitialPage ? `<script data-page="${id}" type="application/json">${JSON.stringify(initialPage).replace(/\//g, "\\/")}<\/script><div data-server-rendered="true" id="${id}">${html2}</div>` : `<div data-server-rendered="true" id="${id}" data-page="${escape(JSON.stringify(initialPage))}">${html2}</div>`,
      head: [head2, css ? `<style data-vite-css>${css.code}</style>` : ""]
    };
  }
  if (!isServer && progress) {
    setupProgress(progress);
  }
}
const config = config$1.extend({});
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
function Icon($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const {
      name,
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth = false,
      iconNode = [],
      children,
      $$slots,
      $$events,
      ...props
    } = $$props;
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...!children && !hasA11yProp(props) && { "aria-hidden": "true" },
        ...props,
        width: size,
        height: size,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        class: clsx(["lucide-icon lucide", name && `lucide-${name}`, props.class])
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]-->`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></svg>`);
  });
}
function Circle_alert($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "10" }],
      ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
      [
        "line",
        { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "circle-alert" },
      /**
       * @component @name CircleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Circle_plus($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "10" }],
      ["path", { "d": "M8 12h8" }],
      ["path", { "d": "M12 8v8" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "circle-plus" },
      /**
       * @component @name CirclePlus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNOCAxMmg4IiAvPgogIDxwYXRoIGQ9Ik0xMiA4djgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-plus
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Log_in($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m10 17 5-5-5-5" }],
      ["path", { "d": "M15 12H3" }],
      ["path", { "d": "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "log-in" },
      /**
       * @component @name LogIn
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTAgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMTUgMTJIMyIgLz4KICA8cGF0aCBkPSJNMTUgM2g0YTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMmgtNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/log-in
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Log_out($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m16 17 5-5-5-5" }],
      ["path", { "d": "M21 12H9" }],
      ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "log-out" },
      /**
       * @component @name LogOut
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMjEgMTJIOSIgLz4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/log-out
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Moon($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "moon" },
      /**
       * @component @name Moon
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAuOTg1IDEyLjQ4NmE5IDkgMCAxIDEtOS40NzMtOS40NzJjLjQwNS0uMDIyLjYxNy40Ni40MDIuODAzYTYgNiAwIDAgMCA4LjI2OCA4LjI2OGMuMzQ0LS4yMTUuODI1LS4wMDQuODAzLjQwMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/moon
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Move_left($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M6 8L2 12L6 16" }],
      ["path", { "d": "M2 12H22" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "move-left" },
      /**
       * @component @name MoveLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiA4TDIgMTJMNiAxNiIgLz4KICA8cGF0aCBkPSJNMiAxMkgyMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/move-left
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Move_right($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M18 8L22 12L18 16" }],
      ["path", { "d": "M2 12H22" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "move-right" },
      /**
       * @component @name MoveRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggOEwyMiAxMkwxOCAxNiIgLz4KICA8cGF0aCBkPSJNMiAxMkgyMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/move-right
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Pencil($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
        }
      ],
      ["path", { "d": "m15 5 4 4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "pencil" },
      /**
       * @component @name Pencil
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pencil
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Trash($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
      ["path", { "d": "M3 6h18" }],
      ["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "trash" },
      /**
       * @component @name Trash
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgNnYxNGEyIDIgMCAwIDEtMiAySDdhMiAyIDAgMCAxLTItMlY2IiAvPgogIDxwYXRoIGQ9Ik0zIDZoMTgiIC8+CiAgPHBhdGggZD0iTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trash
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function X($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M18 6 6 18" }],
      ["path", { "d": "m6 6 12 12" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "x" },
      /**
       * @component @name X
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Alert($$renderer, $$props) {
  let { children } = $$props;
  {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<div class="flex justify-between items-center gap-3 border p-3 rounded-lg shadow mb-6"><div class="inline-flex items-center gap-3">`);
    Circle_alert($$renderer, { size: 16 });
    $$renderer.push(`<!----> <div>`);
    children($$renderer);
    $$renderer.push(`<!----></div></div> <span></span> <button class="cursor-pointer" aria-label="Close">`);
    X($$renderer, { size: 16 });
    $$renderer.push(`<!----></button></div>`);
  }
  $$renderer.push(`<!--]-->`);
}
function Theme($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<button class="cursor-pointer">`);
    Moon($$renderer2, { size: 16 });
    $$renderer2.push(`<!----></button>`);
  });
}
function App($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children } = $$props;
    $$renderer2.push(`<main class="mx-auto max-w-2xl my-6 px-6 md:my-12"><nav class="flex justify-between items-center border-b dark:border-zinc-700 pb-2 mb-8"><h1 class="font-bold">`);
    Link($$renderer2, {
      href: "/",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$page", page).props.name)}`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></h1> <div class="inline-flex gap-3">`);
    Theme($$renderer2);
    $$renderer2.push(`<!----> `);
    if (store_get($$store_subs ??= {}, "$page", page).props.auth.user) {
      $$renderer2.push("<!--[-->");
      Link($$renderer2, {
        href: "/posts/create",
        children: ($$renderer3) => {
          Circle_plus($$renderer3, { size: 16 });
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <button class="cursor-pointer">`);
      Log_out($$renderer2, { size: 16 });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!store_get($$store_subs ??= {}, "$page", page).props.auth.user) {
      $$renderer2.push("<!--[-->");
      Link($$renderer2, {
        href: "/login",
        children: ($$renderer3) => {
          Log_in($$renderer3, { size: 16 });
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></nav> `);
    if (store_get($$store_subs ??= {}, "$page", page).props.flash) {
      $$renderer2.push("<!--[-->");
      Alert($$renderer2, {
        children: ($$renderer3) => {
          $$renderer3.push(`${html(store_get($$store_subs ??= {}, "$page", page).props.flash)}`);
        }
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    children($$renderer2);
    $$renderer2.push(`<!----></main>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Login($$renderer) {
  head("6yrdmd", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Log In</title>`);
    });
  });
  App($$renderer, {
    children: ($$renderer2) => {
      {
        let children = function($$renderer3, { errors }, processing) {
          $$renderer3.push(`<div class="mb-3"><input type="email" name="email" placeholder="E-mail" class="rounded-lg dark:bg-zinc-800 w-full"/> `);
          if (errors.email) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="text-red-500 text-sm mt-1">${escape_html(errors.email)}</div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div> <div class="mb-3"><input type="password" name="password" placeholder="Password" class="rounded-lg dark:bg-zinc-800 w-full"/> `);
          if (errors.password) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="text-red-500 text-sm mt-1">${escape_html(errors.password)}</div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div> <button type="submit" class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer w-full">Log In</button>`);
        };
        Form($$renderer2, {
          action: "/login",
          method: "post",
          children,
          $$slots: { default: true }
        });
      }
    }
  });
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
function Create($$renderer) {
  head("2wsm85", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Add New Post</title>`);
    });
  });
  App($$renderer, {
    children: ($$renderer2) => {
      {
        let children = function($$renderer3, { errors }, processing) {
          $$renderer3.push(`<div class="mb-3"><input type="text" name="title" placeholder="Title" class="rounded-lg dark:bg-zinc-800 w-full"/> `);
          if (errors.title) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="text-red-500 text-sm mt-1">${escape_html(errors.title)}</div>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div> <div class="mb-3"><textarea name="content" rows="5" placeholder="Content" class="rounded-lg dark:bg-zinc-800 w-full"></textarea></div> <button type="submit" class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer w-full">Save</button>`);
        };
        Form($$renderer2, {
          action: "/posts",
          method: "post",
          disableWhileProcessing: true,
          children,
          $$slots: { default: true }
        });
      }
    }
  });
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Create
}, Symbol.toStringTag, { value: "Module" }));
function Edit($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { post } = $$props;
    head("1tno791", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Edit Post</title>`);
      });
    });
    App($$renderer2, {
      children: ($$renderer3) => {
        {
          let children = function($$renderer4, { errors }, processing) {
            $$renderer4.push(`<div class="mb-3"><input type="text" name="title"${attr("value", post.title)} placeholder="Title" class="rounded-lg dark:bg-zinc-800 w-full"/> `);
            if (errors.title) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="text-red-500 text-sm mt-1">${escape_html(errors.title)}</div>`);
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div> <div class="mb-3"><textarea name="content" rows="10" placeholder="Content" class="rounded-lg dark:bg-zinc-800 w-full">`);
            const $$body = escape_html(post.content);
            if ($$body) {
              $$renderer4.push(`${$$body}`);
            }
            $$renderer4.push(`</textarea></div> <button type="submit" class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer w-full">Update</button>`);
          };
          Form($$renderer3, {
            action: `/posts/${stringify(post.id)}`,
            method: "patch",
            disableWhileProcessing: true,
            children,
            $$slots: { default: true }
          });
        }
      }
    });
  });
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Edit
}, Symbol.toStringTag, { value: "Module" }));
function Pagination($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    $$renderer2.push(`<div class="text-center mt-6"><div class="flex justify-between items-center gap-4">`);
    if (data.prev_page_url) {
      $$renderer2.push("<!--[-->");
      Link($$renderer2, {
        href: data.prev_page_url,
        children: ($$renderer3) => {
          Move_left($$renderer3, { size: 16 });
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="cursor-default" disabled>`);
      Move_left($$renderer2, { size: 16 });
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (data.next_page_url) {
      $$renderer2.push("<!--[-->");
      Link($$renderer2, {
        href: data.next_page_url,
        children: ($$renderer3) => {
          Move_right($$renderer3, { size: 16 });
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="cursor-default" disabled>`);
      Move_right($$renderer2, { size: 16 });
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function Index($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { posts } = $$props;
    head("g5n0u1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(store_get($$store_subs ??= {}, "$page", page).props.name)}</title>`);
      });
    });
    App($$renderer2, {
      children: ($$renderer3) => {
        if (posts.data.length == 0) {
          $$renderer3.push("<!--[-->");
          Alert($$renderer3, {
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Empty.`);
            }
          });
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(posts.data);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let post = each_array[$$index];
            $$renderer3.push(`<div class="border-b dark:border-zinc-700 pb-2 mb-2">`);
            Link($$renderer3, {
              href: `/posts/${stringify(post.id)}`,
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(post.title)}`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div>`);
          }
          $$renderer3.push(`<!--]--> `);
          Pagination($$renderer3, { data: posts });
          $$renderer3.push(`<!---->`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
function Delete($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { post } = $$props;
    $$renderer2.push(`<button type="button" class="cursor-pointer">`);
    Trash($$renderer2, { size: 16 });
    $$renderer2.push(`<!----></button> <dialog class="w-full mx-auto my-auto -translate-x-0.5 md:w-1/3 border border-zinc-100 dark:border-zinc-600 rounded-lg shadow dark:bg-zinc-900 dark:text-white/90 bg-zinc-50 backdrop:backdrop-blur">`);
    Form($$renderer2, {
      action: `/posts/${stringify(post.id)}`,
      method: "delete",
      disableWhileProcessing: true,
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="p-6"><p>Delete this post?</p></div> <div class="flex justify-end gap-3 p-3 bg-zinc-100 dark:bg-zinc-800"><div class="flex justify-between gap-4"><button class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer">No</button> <button type="submit" class="p-2 border border-red-500 bg-red-500 rounded-lg text-sm cursor-pointer">Yes</button></div></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></dialog>`);
  });
}
function Show($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { post } = $$props;
    head("1lnq9qy", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(post.title)}</title>`);
      });
    });
    App($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<article><div class="flex justify-between items-center border-b pb-3 mb-3"><div class="title font-bold">${escape_html(post.title)}</div> `);
        if (store_get($$store_subs ??= {}, "$page", page).props.auth) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="inline-flex items-center gap-3">`);
          Link($$renderer3, {
            href: `/posts/${stringify(post.id)}/edit`,
            title: "Edit Post",
            children: ($$renderer4) => {
              Pencil($$renderer4, { size: 16 });
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Delete($$renderer3, { post });
          $$renderer3.push(`<!----></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div> <div class="content prose max-w-none mb-3">${html(post.content_to_html)}</div></article>`);
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Show
}, Symbol.toStringTag, { value: "Module" }));
createServer(
  (page2) => createInertiaApp({
    page: page2,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./pages/auth/Login.svelte": __vite_glob_0_0, "./pages/posts/Create.svelte": __vite_glob_0_1, "./pages/posts/Edit.svelte": __vite_glob_0_2, "./pages/posts/Index.svelte": __vite_glob_0_3, "./pages/posts/Show.svelte": __vite_glob_0_4 });
      return pages[`./pages/${name}.svelte`];
    },
    setup({ App: App2, props }) {
      return render(App2, { props });
    }
  })
);
