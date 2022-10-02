export const PAGES = {
    overview: Symbol("overview"),
    interactive: Symbol("interactive"),
    print: Symbol("print"),
    error: Symbol("error"),
};

export const PageToURL = {
    [PAGES.interactive]: "/i",
    [PAGES.overview]: "/o",
    [PAGES.print]: "/p",
    [PAGES.error]: "/o",
};
