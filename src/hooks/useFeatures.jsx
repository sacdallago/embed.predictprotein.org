import { useQuery } from "react-query";

import { FeatureRequest, fetch_features } from "../lib/api";
import useSequence from "./useSequence";

export function useFeatures(select) {
    const { data, isSuccess } = useSequence();

    const request = new FeatureRequest(data?.sequence);

    const sequenceQuery = useQuery({
        queryKey: ["features", data?.sequence],
        queryFn: () => fetch_features(request),
        staleTime: "Infinity",
        refetchOnWindowFocus: false,
        enabled: isSuccess,
        retry: 3,
        select: select,
    });

    return sequenceQuery;
}
