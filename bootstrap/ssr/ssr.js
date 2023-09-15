import { router, setupProgress } from "@inertiajs/core";
import isEqual from "lodash.isequal";
import cloneDeep from "lodash.clonedeep";
import createServer from "@inertiajs/core/server";
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function subscribe(store2, ...callbacks) {
  if (store2 == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store2.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
const _boolean_attributes = (
  /** @type {const} */
  [
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
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
    "selected"
  ]
);
const boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);
const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, attrs_to_add) {
  const attributes = Object.assign({}, ...args);
  if (attrs_to_add) {
    const classes_to_add = attrs_to_add.classes;
    const styles_to_add = attrs_to_add.styles;
    if (classes_to_add) {
      if (attributes.class == null) {
        attributes.class = classes_to_add;
      } else {
        attributes.class += " " + classes_to_add;
      }
    }
    if (styles_to_add) {
      if (attributes.style == null) {
        attributes.style = style_object_to_string(styles_to_add);
      } else {
        attributes.style = style_object_to_string(
          merge_ssr_styles(attributes.style, styles_to_add)
        );
      }
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
function merge_ssr_styles(style_attribute, style_directive) {
  const style_object = {};
  for (const individual_style of style_attribute.split(";")) {
    const colon_index = individual_style.indexOf(":");
    const name = individual_style.slice(0, colon_index).trim();
    const value = individual_style.slice(colon_index + 1).trim();
    if (!name)
      continue;
    style_object[name] = value;
  }
  for (const name in style_directive) {
    const value = style_directive[name];
    if (value) {
      style_object[name] = value;
    } else {
      delete style_object[name];
    }
  }
  return style_object;
}
const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;
function escape(value, is_attr = false) {
  const str = String(value);
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
function escape_attribute_value(value) {
  const should_escape = typeof value === "string" || value && typeof value === "object";
  return should_escape ? escape(value, true) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
}
function each(items, fn) {
  items = ensure_array_like(items);
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(
      `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`
    );
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      // these will be immediately discarded
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css) => css.code).join("\n"),
          map: null
          // TODO
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  const assignment = boolean && value === true ? "" : `="${escape(value, true)}"`;
  return ` ${name}${assignment}`;
}
function style_object_to_string(style_object) {
  return Object.keys(style_object).filter((key) => style_object[key]).map((key) => `${key}: ${escape_attribute_value(style_object[key])};`).join(" ");
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
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
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set, update) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store2, i) => subscribe(
        store2,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
const store = writable({
  component: null,
  layout: [],
  page: {},
  key: null
});
const h = (component, props, children) => {
  return {
    component,
    ...props ? { props } : {},
    ...children ? { children } : {}
  };
};
const Render = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $store, $$unsubscribe_store;
  $$unsubscribe_store = subscribe(store, (value) => $store = value);
  let { component } = $$props;
  let { props = {} } = $$props;
  let { children = [] } = $$props;
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  $$unsubscribe_store();
  return `${$store.component ? `${validate_component(component || missing_component, "svelte:component").$$render($$result, Object.assign({}, props), {}, {
    default: () => {
      return `${each(children, (child, index) => {
        return `${validate_component(Render, "svelte:self").$$render($$result, Object.assign({}, child), {}, {})}`;
      })}`;
    }
  })}` : ``}`;
});
const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let child;
  let layout;
  let components;
  let $store, $$unsubscribe_store;
  $$unsubscribe_store = subscribe(store, (value) => $store = value);
  child = $store.component && h($store.component.default, $store.page.props);
  layout = $store.component && $store.component.layout;
  components = layout ? Array.isArray(layout) ? layout.concat(child).reverse().reduce((child2, layout2) => h(layout2, $store.page.props, [child2])) : h(layout, $store.page.props, [child]) : child;
  $$unsubscribe_store();
  return `${validate_component(Render, "Render").$$render($$result, Object.assign({}, components), {}, {})}`;
});
const SSR = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id, initialPage } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.initialPage === void 0 && $$bindings.initialPage && initialPage !== void 0)
    $$bindings.initialPage(initialPage);
  return `<div data-server-rendered="true"${add_attribute("id", id, 0)}${add_attribute("data-page", JSON.stringify(initialPage), 0)}>${validate_component(App, "App").$$render($$result, {}, {}, {})}</div>`;
});
async function createInertiaApp({ id = "app", resolve, setup, progress = {}, page: page2 }) {
  const isServer = typeof window === "undefined";
  const el = isServer ? null : document.getElementById(id);
  const initialPage = page2 || JSON.parse(el.dataset.page);
  const resolveComponent = (name) => Promise.resolve(resolve(name));
  await resolveComponent(initialPage.component).then((initialComponent) => {
    store.set({
      component: initialComponent,
      page: initialPage
    });
  });
  if (!isServer) {
    router.init({
      initialPage,
      resolveComponent,
      swapComponent: async ({ component, page: page3, preserveState }) => {
        store.update((current) => ({
          component,
          page: page3,
          key: preserveState ? current.key : Date.now()
        }));
      }
    });
    if (progress) {
      setupProgress(progress);
    }
    return setup({
      el,
      App,
      props: {
        initialPage,
        resolveComponent
      }
    });
  }
  if (isServer) {
    const { html, head } = SSR.render({ id, initialPage });
    return {
      body: html,
      head: [head]
    };
  }
}
const Link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "href",
    "as",
    "data",
    "method",
    "replace",
    "preserveScroll",
    "preserveState",
    "only",
    "headers",
    "queryStringArrayFormat"
  ]);
  let { href } = $$props;
  let { as = "a" } = $$props;
  let { data = {} } = $$props;
  let { method = "get" } = $$props;
  let { replace = false } = $$props;
  let { preserveScroll = false } = $$props;
  let { preserveState = null } = $$props;
  let { only = [] } = $$props;
  let { headers = {} } = $$props;
  let { queryStringArrayFormat = "brackets" } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.as === void 0 && $$bindings.as && as !== void 0)
    $$bindings.as(as);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.method === void 0 && $$bindings.method && method !== void 0)
    $$bindings.method(method);
  if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0)
    $$bindings.replace(replace);
  if ($$props.preserveScroll === void 0 && $$bindings.preserveScroll && preserveScroll !== void 0)
    $$bindings.preserveScroll(preserveScroll);
  if ($$props.preserveState === void 0 && $$bindings.preserveState && preserveState !== void 0)
    $$bindings.preserveState(preserveState);
  if ($$props.only === void 0 && $$bindings.only && only !== void 0)
    $$bindings.only(only);
  if ($$props.headers === void 0 && $$bindings.headers && headers !== void 0)
    $$bindings.headers(headers);
  if ($$props.queryStringArrayFormat === void 0 && $$bindings.queryStringArrayFormat && queryStringArrayFormat !== void 0)
    $$bindings.queryStringArrayFormat(queryStringArrayFormat);
  return `${((tag) => {
    return tag ? `<${as}${spread([escape_object(as === "a" ? { href } : {}), escape_object($$restProps)], {})}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(as)}`;
});
const page = derived(store, ($store) => $store.page);
function useForm(...args) {
  const rememberKey = typeof args[0] === "string" ? args[0] : null;
  const data = (typeof args[0] === "string" ? args[1] : args[0]) || {};
  const restored = rememberKey ? router.restore(rememberKey) : null;
  let defaults = cloneDeep(data);
  let cancelToken = null;
  let recentlySuccessfulTimeoutId = null;
  let transform = (data2) => data2;
  const store2 = writable({
    ...restored ? restored.data : data,
    isDirty: false,
    errors: restored ? restored.errors : {},
    hasErrors: false,
    progress: null,
    wasSuccessful: false,
    recentlySuccessful: false,
    processing: false,
    setStore(key, value) {
      store2.update((store3) => {
        return Object.assign(store3, typeof key === "string" ? { [key]: value } : key);
      });
    },
    data() {
      return Object.keys(data).reduce((carry, key) => {
        carry[key] = this[key];
        return carry;
      }, {});
    },
    transform(callback) {
      transform = callback;
      return this;
    },
    defaults(key, value) {
      if (typeof key === "undefined") {
        defaults = Object.assign(defaults, cloneDeep(this.data()));
        return this;
      }
      defaults = Object.assign(defaults, cloneDeep(value ? { [key]: value } : key));
      return this;
    },
    reset(...fields) {
      let clonedDefaults = cloneDeep(defaults);
      if (fields.length === 0) {
        this.setStore(clonedDefaults);
      } else {
        this.setStore(
          Object.keys(clonedDefaults).filter((key) => fields.includes(key)).reduce((carry, key) => {
            carry[key] = clonedDefaults[key];
            return carry;
          }, {})
        );
      }
      return this;
    },
    setError(key, value) {
      this.setStore("errors", {
        ...this.errors,
        ...value ? { [key]: value } : key
      });
      return this;
    },
    clearErrors(...fields) {
      this.setStore(
        "errors",
        Object.keys(this.errors).reduce(
          (carry, field) => ({
            ...carry,
            ...fields.length > 0 && !fields.includes(field) ? { [field]: this.errors[field] } : {}
          }),
          {}
        )
      );
      return this;
    },
    submit(method, url, options = {}) {
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
          this.setStore("wasSuccessful", false);
          this.setStore("recentlySuccessful", false);
          clearTimeout(recentlySuccessfulTimeoutId);
          if (options.onBefore) {
            return options.onBefore(visit);
          }
        },
        onStart: (visit) => {
          this.setStore("processing", true);
          if (options.onStart) {
            return options.onStart(visit);
          }
        },
        onProgress: (event) => {
          this.setStore("progress", event);
          if (options.onProgress) {
            return options.onProgress(event);
          }
        },
        onSuccess: async (page2) => {
          this.setStore("processing", false);
          this.setStore("progress", null);
          this.clearErrors();
          this.setStore("wasSuccessful", true);
          this.setStore("recentlySuccessful", true);
          recentlySuccessfulTimeoutId = setTimeout(() => this.setStore("recentlySuccessful", false), 2e3);
          if (options.onSuccess) {
            return options.onSuccess(page2);
          }
        },
        onError: (errors) => {
          this.setStore("processing", false);
          this.setStore("progress", null);
          this.clearErrors().setError(errors);
          if (options.onError) {
            return options.onError(errors);
          }
        },
        onCancel: () => {
          this.setStore("processing", false);
          this.setStore("progress", null);
          if (options.onCancel) {
            return options.onCancel();
          }
        },
        onFinish: () => {
          this.setStore("processing", false);
          this.setStore("progress", null);
          cancelToken = null;
          if (options.onFinish) {
            return options.onFinish();
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
      if (cancelToken) {
        cancelToken.cancel();
      }
    }
  });
  store2.subscribe((form) => {
    if (form.isDirty === isEqual(form.data(), defaults)) {
      form.setStore("isDirty", !form.isDirty);
    }
    const hasErrors = Object.keys(form.errors).length > 0;
    if (form.hasErrors !== hasErrors) {
      form.setStore("hasErrors", !form.hasErrors);
    }
    if (rememberKey) {
      router.remember({ data: form.data(), errors: form.errors }, rememberKey);
    }
  });
  return store2;
}
const Alert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${`<div class="alert alert-warning shadow-lg mb-6"><div><i class="bi bi-info-circle"></i> ${slots.default ? slots.default({}) : ``}</div> <span></span> <button data-svelte-h="svelte-srze8x"><i class="bi bi-x-circle"></i></button></div>`}`;
});
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Alert
}, Symbol.toStringTag, { value: "Module" }));
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<main class="flex justify-between items-center border-b border-primary pb-2 mb-8"><h1 class="font-bold uppercase">${validate_component(Link, "Link").$$render($$result, { href: "/" }, {}, {
    default: () => {
      return `${escape($page.props.appName)}`;
    }
  })}</h1> <div class="inline-flex gap-3">${$page.props.auth.user ? `${validate_component(Link, "Link").$$render($$result, { href: "/posts/create" }, {}, {
    default: () => {
      return `<i class="bi bi-plus-circle"></i>`;
    }
  })} <button data-svelte-h="svelte-8lizb6"><i class="bi bi-box-arrow-right"></i></button>` : ``} ${!$page.props.auth.user ? `${validate_component(Link, "Link").$$render($$result, { href: "/login" }, {}, {
    default: () => {
      return `<i class="bi bi-box-arrow-in-right"></i>`;
    }
  })}` : ``}</div></main> ${$page.props.flash.message ? `${validate_component(Alert, "Alert").$$render($$result, {}, {}, {
    default: () => {
      return `<!-- HTML_TAG_START -->${$page.props.flash.message}<!-- HTML_TAG_END -->`;
    }
  })}` : ``} ${slots.default ? slots.default({}) : ``}`;
});
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Layout
}, Symbol.toStringTag, { value: "Module" }));
const Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $form, $$unsubscribe_form;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let form = useForm({ email: "", password: "" });
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  $$unsubscribe_form();
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-1mf31g6_START -->${$$result.title = `<title>Log In</title>`, ""}<!-- HEAD_svelte-1mf31g6_END -->`, ""} ${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="w-full md:w-2/3 md:mx-auto"><form><input type="hidden" name="_token"${add_attribute("value", $page.props.csrfToken, 0)}> <div class="mb-3"><input type="email" placeholder="E-mail" class="input input-bordered w-full"${add_attribute("value", $form.email, 0)}> ${$form.errors.email ? `<div class="text-error text-sm font-bold mt-1">${escape($form.errors.email)}</div>` : ``}</div> <div class="mb-3"><input type="password" placeholder="Password" class="input input-bordered w-full"${add_attribute("value", $form.password, 0)}> ${$form.errors.password ? `<div class="text-error text-sm font-bold mt-1">${escape($form.errors.password)}</div>` : ``}</div> <button type="submit" class="btn btn-primary" ${$form.processing ? "disabled" : ""}>Log In</button></form></div>`;
    }
  })}`;
});
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
const Pagination = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="text-center mt-6"><div class="join gap-3">${data.prev_page_url ? `${validate_component(Link, "Link").$$render(
    $$result,
    {
      href: data.prev_page_url,
      class: "join-item hover:font-bold text-lg"
    },
    {},
    {
      default: () => {
        return `<i class="bi bi-arrow-left"></i>`;
      }
    }
  )}` : `<button class="btn-disabled" data-svelte-h="svelte-ksgxv3"><i class="bi bi-arrow-left text-lg"></i></button>`} ${data.next_page_url ? `${validate_component(Link, "Link").$$render(
    $$result,
    {
      href: data.next_page_url,
      class: "join-item hover:font-bold text-lg"
    },
    {},
    {
      default: () => {
        return `<i class="bi bi-arrow-right"></i>`;
      }
    }
  )}` : `<button class="btn-disabled" data-svelte-h="svelte-1hi5rms"><i class="bi bi-arrow-right text-lg"></i></button>`}</div></div>`;
});
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pagination
}, Symbol.toStringTag, { value: "Module" }));
const Create = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $form, $$unsubscribe_form;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let form = useForm({ title: null, content: null });
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  $$unsubscribe_form();
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-jkbflm_START -->${$$result.title = `<title>Add New Post</title>`, ""}<!-- HEAD_svelte-jkbflm_END -->`, ""} ${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<form><input type="hidden" name="_token"${add_attribute("value", $page.props.csrfToken, 0)}> <div class="mb-3"><input type="text" placeholder="Title" class="input input-bordered w-full"${add_attribute("value", $form.title, 0)}> ${$form.errors.title ? `<div class="text-error text-sm font-bold mt-1">${escape($form.errors.title)}</div>` : ``}</div> <div class="mb-3"><textarea rows="5" placeholder="Content" class="textarea textarea-bordered w-full">${escape($form.content || "")}</textarea></div> <button type="submit" class="btn btn-primary" ${$form.processing ? "disabled" : ""}>Save</button></form>`;
    }
  })}`;
});
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Create
}, Symbol.toStringTag, { value: "Module" }));
const Edit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $form, $$unsubscribe_form;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { post } = $$props;
  let form = useForm({ title: post.title, content: post.content });
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  if ($$props.post === void 0 && $$bindings.post && post !== void 0)
    $$bindings.post(post);
  $$unsubscribe_form();
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-jtmlrv_START -->${$$result.title = `<title>Edit Post</title>`, ""}<!-- HEAD_svelte-jtmlrv_END -->`, ""} ${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<form><input type="hidden" name="_token"${add_attribute("value", $page.props.csrfToken, 0)}> <div class="mb-3"><input type="text" placeholder="Title" class="input input-bordered w-full"${add_attribute("value", $form.title, 0)}> ${$form.errors.title ? `<div class="text-error font-bold text-sm mt-1">${escape($form.errors.title)}</div>` : ``}</div> <div class="mb-3"><textarea rows="10" placeholder="Content" class="textarea textarea-bordered w-full">${escape($form.content || "")}</textarea></div> <button type="submit" class="btn btn-primary" ${$form.processing ? "disabled" : ""}>Save</button></form>`;
    }
  })}`;
});
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Edit
}, Symbol.toStringTag, { value: "Module" }));
const Index = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_form;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { posts } = $$props;
  let dialog;
  let post;
  let form = useForm();
  $$unsubscribe_form = subscribe(form, (value) => value);
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  $$unsubscribe_form();
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-138sga8_START -->${$$result.title = `<title>${escape($page.props.appName)}</title>`, ""}<!-- HEAD_svelte-138sga8_END -->`, ""} ${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${posts.data.length == 0 ? `${validate_component(Alert, "Alert").$$render($$result, {}, {}, {
        default: () => {
          return `Empty.`;
        }
      })}` : `${each(posts.data, (post2) => {
        return `<div class="flex justify-between items-baseline border-b border-base-300 pb-2 mb-2"><div class="note-title">${validate_component(Link, "Link").$$render($$result, { href: "/posts/" + post2.id }, {}, {
          default: () => {
            return `${escape(post2.title)}`;
          }
        })}</div> ${$page.props.auth.user ? `<div class="inline-flex gap-3">${validate_component(Link, "Link").$$render(
          $$result,
          {
            href: "/posts/" + post2.id + "/edit",
            title: "Edit Post",
            class: "text-gray-500"
          },
          {},
          {
            default: () => {
              return `<i class="bi bi-pencil-square"></i>`;
            }
          }
        )} <button title="Delete Post" class="text-gray-500" data-svelte-h="svelte-imfvtk"><i class="bi bi-trash"></i></button> </div>` : ``} </div>`;
      })} ${validate_component(Pagination, "Pagination").$$render($$result, { data: posts }, {}, {})}`}`;
    }
  })} <dialog class="modal"${add_attribute("this", dialog, 0)}><form class="modal-box"><input type="hidden"${add_attribute("this", post, 0)}> <h3 class="font-bold text-lg" data-svelte-h="svelte-1wl5w2x">Confirm</h3> <p class="py-4" data-svelte-h="svelte-11bh441">Delete this post?</p> <div class="modal-action"><button class="btn btn-neutral btn-sm" data-svelte-h="svelte-uzaast">No</button> <button type="submit" class="btn btn-error btn-sm" data-svelte-h="svelte-16ac55">Yes</button></div></form></dialog>`;
});
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const Show = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_form;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { post } = $$props;
  let dialog;
  let form = useForm();
  $$unsubscribe_form = subscribe(form, (value) => value);
  if ($$props.post === void 0 && $$bindings.post && post !== void 0)
    $$bindings.post(post);
  $$unsubscribe_form();
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-rixpl3_START -->${$$result.title = `<title>${escape(post.title)}</title>`, ""}<!-- HEAD_svelte-rixpl3_END -->`, ""} ${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<article><div class="flex justify-between items-center border-b border-base-300 pb-3 mb-3"><div class="title font-bold">${escape(post.title)}</div> ${$page.props.auth.user ? `<div class="inline-flex gap-3">${validate_component(Link, "Link").$$render(
        $$result,
        {
          href: "/posts/" + post.id + "/edit",
          title: "Edit Post",
          class: "text-gray-500"
        },
        {},
        {
          default: () => {
            return `<i class="bi bi-pencil-square"></i>`;
          }
        }
      )} <button title="Delete Post" class="text-gray-500" data-svelte-h="svelte-or3z96"><i class="bi bi-trash"></i></button></div>` : ``}</div> <div class="content prose max-w-none mb-3"><!-- HTML_TAG_START -->${post.contentToHtml}<!-- HTML_TAG_END --></div></article>`;
    }
  })} <dialog class="modal"${add_attribute("this", dialog, 0)}><form class="modal-box"><h3 class="font-bold text-lg" data-svelte-h="svelte-1wl5w2x">Confirm</h3> <p class="py-4" data-svelte-h="svelte-11bh441">Delete this post?</p> <div class="modal-action"><button type="submit" class="btn btn-error btn-sm" data-svelte-h="svelte-16ac55">Yes</button> <button class="btn btn-neutral btn-sm" data-svelte-h="svelte-uzaast">No</button></div></form></dialog>`;
});
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Show
}, Symbol.toStringTag, { value: "Module" }));
createServer(
  (page2) => createInertiaApp({
    page: page2,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/Auth/Login.svelte": __vite_glob_0_0, "./Pages/Components/Alert.svelte": __vite_glob_0_1, "./Pages/Components/Pagination.svelte": __vite_glob_0_2, "./Pages/Layout.svelte": __vite_glob_0_3, "./Pages/Posts/Create.svelte": __vite_glob_0_4, "./Pages/Posts/Edit.svelte": __vite_glob_0_5, "./Pages/Posts/Index.svelte": __vite_glob_0_6, "./Pages/Posts/Show.svelte": __vite_glob_0_7 });
      return pages[`./Pages/${name}.svelte`];
    }
  })
);
