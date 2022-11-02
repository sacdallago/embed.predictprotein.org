import { useQuery } from "react-query";

import useSequence from "./useSequence";
import { structureFromAFDB } from "../lib/afdb_api";
import { fetch_structure } from "../lib/bioembd_api";

export const MAX_SEQ_LEN = 500;

export function useStructure(select) {
    const { data: seqData, isSuccess: seqIsSuccess } = useSequence();

    let queryAFDB = seqIsSuccess && seqData?.accession !== undefined;

    const {
        isError: afdbIsError,
        isSuccess: afdbIsSuccess,
        isLoading: afdbIsLoading,
        data: afdbData,
    } = useQuery({
        queryKey: ["structure", "afdb", seqData?.accession],
        queryFn: () => structureFromAFDB(seqData?.accession),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        enabled: queryAFDB,
        retry: 3,
        select: select,
    });

    let predictStructure =
        seqIsSuccess &&
        seqData.sequence.length <= MAX_SEQ_LEN &&
        (seqData?.accession === undefined || afdbIsError);

    const {
        isError: predIsError,
        isSuccess: predIsSuccess,
        isLoading: predIsLoading,
        data: predData,
    } = useQuery({
        queryKey: ["structure", "predicted", seqData?.sequence],
        queryFn: () =>
            fetch_structure(seqData?.sequence, Infinity, 5 * 60 * 100),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        enabled: predictStructure,
        retry: 3,
        select: select,
    });

    let isError =
        !(predictStructure || queryAFDB) &&
        ((queryAFDB && !predictStructure && afdbIsError) ||
            (!queryAFDB && predictStructure && predIsError) ||
            (queryAFDB && predictStructure && predIsError && afdbIsError));

    let isSuccess =
        ((queryAFDB && afdbIsSuccess) || (predictStructure && predIsSuccess)) &&
        (predictStructure || queryAFDB);

    let isLoading =
        ((queryAFDB && afdbIsLoading) || (predictStructure && predIsLoading)) &&
        (predictStructure || queryAFDB);

    let data = undefined;
    if (queryAFDB && afdbIsSuccess) {
        data = {
            url: afdbData[0].cifUrl,
            format: "mmcif",
            source: "afdb",
        };
    }
    if (predictStructure && predIsSuccess) {
        let pdbBlob = new Blob([predData.structure.pdb], {
            type: "text/plain",
        });
        data = {
            url: URL.createObjectURL(pdbBlob),
            format: "pdb",
            source: "predicted",
        };
    }

    return {
        queryAFDB: queryAFDB,
        predictStructure: predictStructure,
        isError: isError,
        isSuccess: isSuccess,
        isLoading: isLoading,
        data: data,
    };
}
