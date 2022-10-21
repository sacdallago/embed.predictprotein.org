import { get_worker_status } from "../lib/api";
import { get_uniprot_status } from "../lib/sequence";
import { useQueries, useQuery } from "react-query";

export default function useServiceStatus() {
    // TODO add uniprot status

    const workers = [
        "prott5",
        "prott5_annotations",
        "colabfold",
        "prott5_residue_landscape_annotations",
    ];

    const status = useQueries(
        workers.map((worker) => ({
            queryKey: ["status", "workerStatus", worker],
            queryFn: () => get_worker_status(worker),
            refetchInterval: 1000 * 60 * 5,
        }))
    );

    const uniprotStatus = useQuery({
        queryKey: ["status", "uniprotStatus", "uniprot"],
        queryFn: () => get_uniprot_status(),
        refetchInterval: 1000 * 60 * 5,
    });

    status.push(uniprotStatus);

    const names = [
        "Embedding Service",
        "Residue Annotation Service",
        "Structure Service",
        "Sequence Annotation Service",
        "Uniprot Sequence Service",
    ];

    const serviceStatus = names.map((name, idx) => {
        return {
            name: name,
            isLoading: status[idx].isLoading,
            isError: status[idx].isError,
        };
    });

    const globalLoading = serviceStatus.some((element) => element.isLoading);
    const globalError = serviceStatus.some((element) => element.isError);

    return [globalLoading, globalError, serviceStatus];
}
