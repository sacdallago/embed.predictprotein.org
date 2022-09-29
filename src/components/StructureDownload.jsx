import React from "react";
import { Button } from "react-bootstrap";

const resultStatus = null;

class StructureDownload extends React.Component {
    template =
        "<!doctype html>\n<head>\n<title>Loading Foldseek</title>\n<style>\n  body {\n    background-color: #121212;\n    color: #fff;\n    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n    height: 100vh;\n    display: flex;\n    flex-direction: column;\n    flex-wrap: wrap;\n    justify-content: center;\n    align-items: center;\n  }\n  .loader {\n    display: block;\n    width: 80px;\n    height: 80px;\n  }\n  .loader:after {\n    content: \" \";\n    display: block;\n    width: 64px;\n    height: 64px;\n    margin: 8px;\n    border-radius: 50%;\n    border: 6px solid #fff;\n    border-color: #fff transparent #fff transparent;\n    animation: loader 1.2s linear infinite;\n  }\n  @keyframes loader {\n    0% {\n      transform: rotate(0deg);\n    }\n    100% {\n      transform: rotate(360deg);\n    }\n  }\n</style>\n</head>\n<body>\n<div>Foldseek is loading...</div><div class=\"loader\"></div>\n</body>";

    download(data) {
        if (data !== null) {
            let c = document.createElement("a");
            c.download = "structure.pdb";

            let t = new Blob([data], {
                type: "text/plain",
            });

            c.href = window.URL.createObjectURL(t);
            c.click();
        }
    }

    convertToQueryUrl(obj) {
        let params = new URLSearchParams(obj);
        let entries = Object.entries(obj);

        for (let entry in entries) {
            let key = entries[entry][0];
            let value = entries[entry][1];

            if (Array.isArray(value)) {
                params.delete(key);
                value.forEach(function (v) {
                    return params.append(key + "[]", v);
                });
            }
        }

        return params.toString();
    }

    request(method, url, body) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                }

                reject([xhr.status, xhr.statusText]);
            };

            xhr.open(method, url);
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
            );

            if (typeof body != "undefined") {
                xhr.send(this.convertToQueryUrl(body));
            } else {
                xhr.send();
            }
        });
    }

    foldseek(pdb) {
        if (pdb !== null) {
            let w = window.open("", "_blank");

            w.document.body.innerHTML = this.template;

            this.request("POST", "https://search.foldseek.com/api/ticket", {
                q: pdb,
                database: ["afdb50", "afdb-swissprot", "gmgcl_id", "pdb100"],
                mode: "3diaa",
            })
                .then((data) => {
                    w.location =
                        "https://search.foldseek.com/queue/" +
                        JSON.parse(data).id;
                })
                .catch((e) => w.close());
        }
    }

    render() {
        return (
            <div style={{ width: "100%", textAlign: "right" }}>
                {this.props.sequence?.length <= 500 &&
                    this.props.structure?.status === resultStatus.DONE &&
                    this.props.structure?.link === null && (
                        <div>
                            <Button
                                variant="warning"
                                onClick={() =>
                                    this.download(this.props.structure?.pdb)
                                }
                            >
                                Download PDB file
                            </Button>
                            <Button
                                variant="success"
                                onClick={() =>
                                    this.foldseek(this.props.structure?.pdb)
                                }
                            >
                                Launch FoldSeek
                            </Button>
                        </div>
                    )}
            </div>
        );
    }
}

StructureDownload.propTypes = {};

export default StructureDownload;
