import Cite from "citation-js";
import { useQueries } from "react-query";

export function useCitations(citations) {
    const citationStatus = useQueries(
        citations.map((citation) => ({
            queryKey: ["citation", citation],
            queryFn: () => Cite.async(citation),
            refetchInterval: false,
            staleTime: "Infinity",
            cacheTime: "Infinity",
        }))
    );

    const globalLoading = citationStatus.some((element) => element.isLoading);
    const globalError = citationStatus.some((element) => element.isError);
    var data = citationStatus.map((citation) => citation.data);

    return [globalLoading, globalError, data];
}
