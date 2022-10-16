const getKeysFromArrayOfObjects = (array) => [...new Set(array.map(obj => Object.keys(obj)).reduce((list,prev) => prev.concat(list),[]))];


export function arrayToCSV(array){
    let keys = getKeysFromArrayOfObjects(array).sort();

    let result = "";

    result += keys.join(",") + "\n";

    array.forEach(element => {

        keys.slice(0, keys.length-1).forEach(key => {
            result += element[key] + ",";
        });

        result += element[keys[keys.length-1]] +  "\n";
    });

    return result;
}

export function arrayToTSV(array){
    let keys = getKeysFromArrayOfObjects(array).sort();

    let result = "";

    result += keys.join("\t") + "\n";

    array.forEach(element => {

        keys.slice(0, keys.length-1).forEach(key => {
            result += element[key] + "\t";
        });

        result += element[keys[keys.length-1]] +  "\n";
    });

    return result;
}