import { c as createLucideIcon, u as useAuth, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as Layout, f as Button, g as LogIn, S as Skeleton, B as Bookmark, d as Link, h as ue } from "./index-D4tdokbz.js";
import { I as Input } from "./input-DGDa2hNz.js";
import { L as Label, T as Textarea } from "./textarea-CVSyc5WT.js";
import { u as useBackend, a as useQuery, b as useMutation, E as ExternalBlob } from "./use-backend-CSYGU6gL.js";
import { D as DrawingCard } from "./DrawingCard-Cw2-pe6E.js";
import { U as UserRound } from "./index-CctSULxh.js";
import "./badge-DSGlaz1B.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$1);
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
function MyProfilePage() {
  var _a;
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = reactExports.useRef(null);
  const { data: profile, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: savedDrawings, isLoading: savedLoading } = useQuery({
    queryKey: ["drawings", "my-saved"],
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, offset: 0n, limit: 8n };
      return actor.getSavedDrawings(0n, 8n);
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const [username, setUsername] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [avatarFile, setAvatarFile] = reactExports.useState(null);
  const [avatarPreview, setAvatarPreview] = reactExports.useState(null);
  const [initialized, setInitialized] = reactExports.useState(false);
  if (profile && !initialized) {
    setUsername(profile.username);
    setBio(profile.bio);
    if (profile.avatarBlob) setAvatarPreview(profile.avatarBlob.getDirectURL());
    setInitialized(true);
  }
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      let avatarBlob;
      if (avatarFile) {
        const buffer = new Uint8Array(await avatarFile.arrayBuffer());
        avatarBlob = ExternalBlob.fromBytes(buffer);
      }
      await actor.saveCallerUserProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatarBlob
      });
    },
    onSuccess: () => {
      ue.success("Profile saved!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => ue.error("Failed to save profile.")
  });
  const unsaveMutation = useMutation({
    mutationFn: async (id) => {
      if (actor) await actor.unsaveDrawing(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drawings", "my-saved"] })
  });
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "my_profile.auth_gate",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { size: 28, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-2", children: "Sign in to view your profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Manage your artist profile and saved drawings." }),
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
        className: "max-w-2xl mx-auto space-y-6",
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
  const displayInitial = ((_a = username[0]) == null ? void 0 : _a.toUpperCase()) ?? "?";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-1", children: "My Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Manage how you appear on riartsy" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          saveMutation.mutate();
        },
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
                  "data-ocid": "my_profile.upload_avatar_button",
                  children: [
                    avatarPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: avatarPreview,
                        alt: "Avatar",
                        className: "w-16 h-16 rounded-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-2xl font-bold font-display", children: displayInitial }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 16, className: "text-card" }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Click to change your photo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5", children: "JPG, PNG or GIF · Max 5MB" })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "username", children: "Username" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "username",
                placeholder: "Your artist name...",
                value: username,
                onChange: (e) => setUsername(e.target.value),
                maxLength: 50,
                "data-ocid": "my_profile.username_input"
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
                placeholder: "Tell the community about your art style...",
                value: bio,
                onChange: (e) => setBio(e.target.value),
                rows: 3,
                maxLength: 300,
                "data-ocid": "my_profile.bio_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: !username.trim() || saveMutation.isPending,
                className: "gap-2",
                "data-ocid": "my_profile.save_button",
                children: saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" }),
                  "Saving..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
                  " Save Profile"
                ] })
              }
            ),
            saveMutation.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "my_profile.saved_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 16, className: "text-accent" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "My Saved Drawings" }),
        savedDrawings && savedDrawings.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/saved",
            className: "ml-auto text-sm text-primary hover:underline underline-offset-2",
            "data-ocid": "my_profile.view_all_saved_link",
            children: "View all →"
          }
        )
      ] }),
      savedLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-4 gap-4",
          "data-ocid": "my_profile.saved_loading_state",
          children: Array.from({ length: 4 }, (_, i) => `sk-s-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl overflow-hidden border border-border bg-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
                ] })
              ]
            },
            k
          ))
        }
      ) : !savedDrawings || savedDrawings.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-border",
          "data-ocid": "my_profile.saved_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 28, className: "text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "You haven't saved any drawings yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                "data-ocid": "my_profile.browse_button",
                children: "Browse Drawings"
              }
            ) })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-4 gap-4",
          "data-ocid": "my_profile.saved_list",
          children: savedDrawings.items.map((drawing, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            DrawingCard,
            {
              drawing,
              index: idx,
              isSaved: true,
              onSave: (id) => unsaveMutation.mutate(id)
            },
            String(drawing.id)
          ))
        }
      )
    ] })
  ] }) });
}
export {
  MyProfilePage as default
};
