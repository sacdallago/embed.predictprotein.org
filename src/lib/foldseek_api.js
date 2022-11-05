import { request } from "./net_utils";

const template =
    "<!doctype html>\n<head>\n<title>Loading Foldseek</title>\n<style>\n  body {\n    background-color: #121212;\n    color: #fff;\n    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n    height: 100vh;\n    display: flex;\n    flex-direction: column;\n    flex-wrap: wrap;\n    justify-content: center;\n    align-items: center;\n  }\n  .loader {\n    display: block;\n    width: 80px;\n    height: 80px;\n  }\n  .loader:after {\n    content: \" \";\n    display: block;\n    width: 64px;\n    height: 64px;\n    margin: 8px;\n    border-radius: 50%;\n    border: 6px solid #fff;\n    border-color: #fff transparent #fff transparent;\n    animation: loader 1.2s linear infinite;\n  }\n  @keyframes loader {\n    0% {\n      transform: rotate(0deg);\n    }\n    100% {\n      transform: rotate(360deg);\n    }\n  }\n</style>\n</head>\n<body>\n<div>Foldseek is loading...</div><div class=\"loader\"></div>\n</body>";

export function submit_foldseek(pdb) {
    if (pdb !== null) {
        let w = window.open("", "_blank");

        w.document.body.innerHTML = template;

        request("POST", "https://search.foldseek.com/api/ticket", {
            q: pdb,
            database: ["afdb50", "afdb-swissprot", "gmgcl_id", "pdb100"],
            mode: "3diaa",
        })
            .then((data) => {
                w.location =
                    "https://search.foldseek.com/queue/" + JSON.parse(data).id;
            })
            .catch((e) => w.close());
    }
}
