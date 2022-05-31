# Protein
***

## How to use
Require this package via npm, then:

1. In a node application:
    ```javascript
    const Protein = require('protein');

    let testText = "ABBABABABABABABA";

    let parsingFunction = Protein.autodetect(testText);

    if(parsingFunction !== undefined){
        parsingFunction(testText)
            .then(([proteins, _]) => {
                proteins.forEach(p => console.log(p));
            });
    }
    ```

2. For use in web pages
    ```html
    <script src="path/to/build/protein-browser.js"></script>

    <script>
         Protein.fromAccession("P12345")
                 .then(([proteins, raw]) => {
                     var retrievedProtein = proteins[0];
                     createElement(JSON.stringify(retrievedProtein));
                 })
                 .catch(() => {
                     console.error("could not GET protein by accession");
                 });
    </script>
    ```

3. Use non-transpiled methods (e.g. React)
    ```javascript
    import { fromAccession } from 'protein/lib/browser';


    Protein.fromAccession("P12345")
        .then(([proteins, raw]) => {
            var retrievedProtein = proteins[0];
            createElement(JSON.stringify(retrievedProtein));
        })
        .catch(() => {
            console.error("could not GET protein by accession");
        });
    ```

You can refer to the `examples` folder for complete examples and the `docs` for documentation.