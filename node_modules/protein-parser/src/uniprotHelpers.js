let $;
let request;

if (process.browser) {
    $ = require('jquery');
} else {
    request = require('request');
}


export function validUniprotQuery(query) {

    // TODO: this might be a bit difficult to implement syncronously...

    /*
     *
     * THIS IS NOT IMPLEMENTED!!!!!!!!!!!!!
     * THIS IS NOT IMPLEMENTED!!!!!!!!!!!!!
     * THIS IS NOT IMPLEMENTED!!!!!!!!!!!!!
     * THIS IS NOT IMPLEMENTED!!!!!!!!!!!!!
     *
     */

    if(query.length > 60){
        return false;
    }

    let url = 'https://www.accession.org/accession/?format=fasta&query=' + query;

    if (process.browser) {
        return new Promise((resolve, reject) => {
            $.get(url, (fastaProteins) => {
                return fastaProteins.length > 0
            }).fail(() => {
                return false;
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            request
                .get(url, (error, response, fastaProteins) => {
                    if(error){
                        return false;
                    } else {
                        return fastaProteins.length > 0
                    }
                })
        });
    }

    /*
     *
     * THIS IS NOT IMPLEMENTED!!!!!!!!!!!!!
     * THIS IS NOT IMPLEMENTED!!!!!!!!!!!!!
     * THIS IS NOT IMPLEMENTED!!!!!!!!!!!!!
     * THIS IS NOT IMPLEMENTED!!!!!!!!!!!!!
     *
     */
}

// TODO: could use some more work...
export const uniprotNameRegex = /[A-Z0-9]{3,20}_[A-Z0-9]{3,20}/;