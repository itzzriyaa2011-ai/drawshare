import { c as createLucideIcon, r as reactExports, k as useComposedRefs, j as jsxRuntimeExports, g as cn, u as useAuth, L as Layout, B as Button, l as LogIn, S as Skeleton, I as Input, e as Link, m as ue } from "./index-Py_44o3M.js";
import { u as usePrevious, a as useSize, L as Label, T as Textarea } from "./textarea-BQwI_DFu.js";
import { a as useControllableState, P as Primitive, c as composeEventHandlers, b as createContextScope } from "./index-x7uG_jp_.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-A7iytFXg.js";
import { h as useSavedPosts, c as useExplorePosts, i as useUnsavePost, a as useLikePost, E as ExternalBlob } from "./use-posts-_6MsgZwc.js";
import { d as useMyProfile, e as useUpdateProfile, P as PostCard } from "./PostCard-DOWsnu6z.js";
import { C as Camera } from "./camera-DF_9cTwP.js";
import { m as motion, B as Bookmark, C as CircleUser } from "./proxy-e2KdTrn6.js";
import { G as Grid3x3 } from "./grid-3x3-CpmZ5e_5.js";
import "./index-DOdboGrt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
function MyProfilePage() {
  var _a;
  const { isAuthenticated, login, identity } = useAuth();
  const fileInputRef = reactExports.useRef(null);
  const { data: profile, isLoading } = useMyProfile();
  const { data: savedPosts, isLoading: savedLoading } = useSavedPosts();
  const { data: allPosts, isLoading: postsLoading } = useExplorePosts(0n);
  const updateProfile = useUpdateProfile();
  const unsavePost = useUnsavePost();
  const likeMutation = useLikePost();
  const [displayName, setDisplayName] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [isAnonymousByDefault, setIsAnonymousByDefault] = reactExports.useState(false);
  const [avatarFile, setAvatarFile] = reactExports.useState(null);
  const [avatarPreview, setAvatarPreview] = reactExports.useState(null);
  const [initialized, setInitialized] = reactExports.useState(false);
  if (profile && !initialized) {
    setDisplayName(profile.displayName);
    setBio(profile.bio);
    setIsAnonymousByDefault(profile.isAnonymousByDefault);
    if (profile.avatarUrl) setAvatarPreview(profile.avatarUrl);
    setInitialized(true);
  }
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toText();
  const myPosts = reactExports.useMemo(() => {
    if (!allPosts || !myPrincipal) return [];
    return allPosts.filter((p) => {
      var _a2;
      return ((_a2 = p.authorId) == null ? void 0 : _a2.toString()) === myPrincipal;
    });
  }, [allPosts, myPrincipal]);
  async function handleSave(e) {
    e.preventDefault();
    try {
      let avatarBlob;
      if (avatarFile) {
        const buffer = new Uint8Array(await avatarFile.arrayBuffer());
        avatarBlob = ExternalBlob.fromBytes(buffer);
      }
      await updateProfile.mutateAsync({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarBlob,
        isAnonymousByDefault
      });
      ue.success("Profile saved!");
      setAvatarFile(null);
    } catch {
      ue.error("Failed to save profile.");
    }
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "my_profile.auth_gate",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 28, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-2", children: "Sign in to manage your profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Customize your profile, bio, and saved photos." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: login,
              className: "flex items-center gap-2",
              "data-ocid": "my_profile.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 16 }),
                " Sign In"
              ]
            }
          )
        ]
      }
    ) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-3xl mx-auto space-y-6",
        "data-ocid": "my_profile.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-20 rounded-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-32" })
          ] })
        ]
      }
    ) });
  }
  const displayInitial = ((_a = displayName[0]) == null ? void 0 : _a.toUpperCase()) ?? "?";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-1", children: "My Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Manage how you appear on riartsy" })
        ]
      }
    ),
    profile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: [
      { label: "Posts", value: String(profile.postCount) },
      { label: "Followers", value: String(profile.followerCount) },
      { label: "Following", value: String(profile.followingCount) }
    ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl py-4 px-3 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl font-bold text-foreground", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: label })
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.1 },
        className: "bg-card rounded-2xl border border-border p-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-base mb-5", children: "Edit Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: handleSave,
              className: "space-y-6",
              "data-ocid": "my_profile.form",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Profile Picture" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          var _a2;
                          return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                        },
                        className: "relative group shrink-0",
                        "aria-label": "Change profile picture",
                        "data-ocid": "my_profile.upload_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center", children: avatarPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: avatarPreview,
                              alt: "Avatar",
                              className: "w-full h-full object-cover"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-2xl font-bold font-display", children: displayInitial }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 16, className: "text-card" }) })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Click to change your photo" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5", children: "JPG, PNG or GIF · Max 5 MB" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: fileInputRef,
                        type: "file",
                        accept: "image/*",
                        className: "sr-only",
                        onChange: (e) => {
                          var _a2;
                          const f = (_a2 = e.target.files) == null ? void 0 : _a2[0];
                          if (f) {
                            setAvatarFile(f);
                            setAvatarPreview(URL.createObjectURL(f));
                          }
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "display-name", children: "Display Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "display-name",
                      placeholder: "Your name…",
                      value: displayName,
                      onChange: (e) => setDisplayName(e.target.value),
                      maxLength: 50,
                      "data-ocid": "my_profile.display_name_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "bio", children: [
                      "Bio",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      bio.length,
                      "/300"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "bio",
                      placeholder: "Tell the community about yourself…",
                      value: bio,
                      onChange: (e) => setBio(e.target.value),
                      rows: 3,
                      maxLength: 300,
                      "data-ocid": "my_profile.bio_textarea"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Post anonymously by default" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Hide your identity on new posts by default" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: isAnonymousByDefault,
                      onCheckedChange: setIsAnonymousByDefault,
                      "data-ocid": "my_profile.anonymous_switch"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: updateProfile.isPending,
                      className: "gap-2",
                      "data-ocid": "my_profile.save_button",
                      children: updateProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" }),
                        "Saving…"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
                        " Save Profile"
                      ] })
                    }
                  ),
                  updateProfile.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-sm text-accent font-medium",
                      "data-ocid": "my_profile.success_state",
                      children: "Changes saved!"
                    }
                  )
                ] })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.2 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "posts", "data-ocid": "my_profile.content_tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "posts",
                className: "gap-2",
                "data-ocid": "my_profile.posts_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { size: 14 }),
                  "My Posts"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "saved",
                className: "gap-2",
                "data-ocid": "my_profile.saved_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 14 }),
                  "Saved"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "posts", "data-ocid": "my_profile.posts_section", children: postsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 md:grid-cols-3 gap-4",
              "data-ocid": "my_profile.posts_loading_state",
              children: Array.from({ length: 6 }, (_, i) => `sk-p-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl overflow-hidden border border-border bg-card",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }) })
                  ]
                },
                k
              ))
            }
          ) : myPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-14 text-center bg-muted/30 rounded-2xl border border-border",
              "data-ocid": "my_profile.posts_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleUser,
                  {
                    size: 28,
                    className: "text-muted-foreground mb-3"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium mb-1", children: "No posts yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Share your first photo with the community." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/upload", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", "data-ocid": "my_profile.upload_button", children: "Upload a Photo" }) })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "masonry-grid", "data-ocid": "my_profile.posts_list", children: myPosts.map((post, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PostCard,
            {
              post,
              index: idx,
              onLike: (postId) => likeMutation.mutate(postId)
            },
            String(post.id)
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "saved", "data-ocid": "my_profile.saved_section", children: savedLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 md:grid-cols-3 gap-4",
              "data-ocid": "my_profile.saved_loading_state",
              children: Array.from({ length: 6 }, (_, i) => `sk-s-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl overflow-hidden border border-border bg-card",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }) })
                  ]
                },
                k
              ))
            }
          ) : !savedPosts || savedPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-14 text-center bg-muted/30 rounded-2xl border border-border",
              "data-ocid": "my_profile.saved_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 28, className: "text-muted-foreground mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium mb-1", children: "No saved photos yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Save photos you love and find them here." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    "data-ocid": "my_profile.browse_button",
                    children: "Explore Photos"
                  }
                ) })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "masonry-grid", "data-ocid": "my_profile.saved_list", children: savedPosts.map((post, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PostCard,
            {
              post,
              index: idx,
              isSaved: true,
              onSave: (postId) => unsavePost.mutate(postId)
            },
            String(post.id)
          )) }) })
        ] })
      }
    )
  ] }) });
}
export {
  MyProfilePage as default
};
