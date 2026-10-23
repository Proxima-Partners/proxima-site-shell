export declare const chrome: {
    readonly version: "3.1.3";
    readonly domain: "https://liveproxima.org";
    readonly apps: {
        readonly main: {
            readonly basePath: "";
        };
        readonly cafe: {
            readonly basePath: "/cafe";
        };
    };
    readonly header: {
        readonly logo: {
            readonly src: "02-Logos/SVG/Proxima-SF-lockup.svg";
            readonly alt: "Proxima San Francisco";
            readonly label: "Proxima San Francisco, home";
            readonly href: {
                readonly app: "main";
                readonly path: "/";
            };
        };
        readonly skipLink: {
            readonly label: "Skip to content";
            readonly target: "#main";
        };
        readonly nav: readonly [{
            readonly label: "Who We Are";
            readonly href: {
                readonly app: "main";
                readonly path: "/#about";
            };
            readonly source: "FB-022, FB-023";
        }, {
            readonly label: "Stories";
            readonly href: {
                readonly app: "cafe";
                readonly path: "/";
            };
            readonly source: "FB-022; Stories goes to the cafe (Mike, 2026-10-10)";
        }];
        readonly give: {
            readonly label: "Give";
            readonly menuLabel: "Ways to give";
            readonly source: "FB-022 (Give is the primary call to action, in the top bar); FB-024 wording (Mike, 2026-10-08); QCD uses the IRS term (Mike, 2026-10-09); DAF goes to the Give page DAF section (Mike, 2026-10-11); Tributes off and Give cryptocurrency added (Mike, 2026-10-11); Give stock wording matches DonateStock's online flow (Mike, 2026-10-13); Give stock goes to DonateStock's Easy Button donation page (Mike, 2026-10-21); DAF and Give cryptocurrency go straight to DonateStock, like Give stock (Mike, 2026-10-21)";
            readonly items: readonly [{
                readonly label: "Give securely online";
                readonly description: "Your donation matters";
                readonly href: {
                    readonly fundraiseUpForm: "FUNYXMNPKXG";
                };
            }, {
                readonly label: "Donor-Advised Fund (DAF)";
                readonly description: "Make a contribution from your DAF";
                readonly href: {
                    readonly external: "https://donatestock.com/donate/new/daf?ds_platform=easydaf&ein=334450216";
                };
            }, {
                readonly label: "Qualified Charitable Distribution (QCD)";
                readonly description: "Give from your qualified retirement funds";
                readonly href: {
                    readonly app: "main";
                    readonly path: "/give/qcd";
                };
            }, {
                readonly label: "Give stock";
                readonly description: "Fill out a short form online and DonateStock sends the transfer request to your broker.";
                readonly href: {
                    readonly external: "https://donatestock.com/donate/new/?ds_platform=easybutton&ein=334450216";
                };
            }, {
                readonly label: "Check if your employer matches your gift";
                readonly description: "Double your donation with employer matching funds";
                readonly href: {
                    readonly app: "main";
                    readonly path: "/give#matching";
                };
            }, {
                readonly label: "Give cryptocurrency";
                readonly description: "Donate cryptocurrency securely to Proxima.";
                readonly href: {
                    readonly external: "https://donatestock.com/donate/new/crypto?ds_platform=easycrypto&ein=334450216";
                };
            }];
        };
        readonly mobileMenu: {
            readonly openLabel: "Open menu";
            readonly closeLabel: "Close menu";
        };
    };
    readonly sectionBars: {
        readonly cafe: {
            readonly label: "Proxima Cafe";
            readonly source: "Cafe stays visible only as a section name (Mike, 2026-10-10)";
            readonly items: readonly [{
                readonly label: "Proxima Cafe";
                readonly href: {
                    readonly app: "cafe";
                    readonly path: "/";
                };
            }, {
                readonly label: "Blog";
                readonly href: {
                    readonly app: "cafe";
                    readonly path: "/blog";
                };
            }, {
                readonly label: "Articles";
                readonly href: {
                    readonly app: "cafe";
                    readonly path: "/articles";
                };
            }, {
                readonly label: "Interviews";
                readonly href: {
                    readonly app: "cafe";
                    readonly path: "/interviews";
                };
            }];
        };
    };
    readonly footer: {
        readonly source: "Footer carried from v0.5 into v1.0 (Mike, 2026-10-10); the DAF badge goes to the Give page DAF section (Mike, 2026-10-11); the DAF badge goes straight to DonateStock's DAF page (Mike, 2026-10-21)";
        readonly details: readonly ["Proxima Partners, Inc.", "1875 Mission St., Ste. 103 #425 · San Francisco, CA 94103", "EIN 33-4450216"];
        readonly badges: readonly [{
            readonly label: "Donate to Proxima with your donor-advised fund";
            readonly alt: "Do you have a donor-advised fund? Use it to support Proxima San Francisco.";
            readonly image: "/assets/do-you-have-a-daf-footer.png";
            readonly href: {
                readonly external: "https://donatestock.com/donate/new/daf?ds_platform=easydaf&ein=334450216";
            };
        }, {
            readonly label: "View Proxima Partners Inc on Candid";
            readonly alt: "Candid nonprofit transparency seal";
            readonly image: "https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/16402856/svg";
            readonly href: {
                readonly external: "https://app.candid.org/profile/16402856/proxima-partners-inc-33-4450216/?pkId=e146c914-9d6d-4bf0-9f4f-5819149f17d5";
            };
        }];
        readonly policies: readonly [{
            readonly label: "Privacy Policy";
            readonly href: {
                readonly app: "main";
                readonly path: "/privacy-policy";
            };
        }, {
            readonly label: "Messaging Policy";
            readonly href: {
                readonly app: "main";
                readonly path: "/messaging-policy";
            };
        }];
        readonly give: {
            readonly label: "Give";
            readonly href: {
                readonly app: "main";
                readonly path: "/give";
            };
            readonly style: "quiet: Teal semibold text link after the policy links";
            readonly source: "Footer giving touchpoint, storyboard v2.0 (approved by Mike, 2026-10-05); restored in 2.2.1 (Mike, 2026-10-10)";
        };
        readonly meta: "© {year} Proxima Partners, Inc.";
    };
    readonly rules: readonly ["Every page at liveproxima.org, in either app, renders this header and footer with the same labels, order, destinations, tokens and behavior.", "Links into the other app are root-relative on the same domain. Nothing opens a new tab except external giving and Candid links.", "The Give menu needs the Fundraise Up loader on every page that shows it, so fundraiseUpForm items open checkout in place.", "A site may append its own version label after the footer meta line. Nothing else is site-specific."];
};
/** The Brand System release the header and footer come from. */
export declare const brandVersion = "3.1.3";
/** This package's version, stamped on the header and footer as data-proxima-shell-version. */
export declare const shellVersion = "0.5.4";
//# sourceMappingURL=chrome.generated.d.ts.map