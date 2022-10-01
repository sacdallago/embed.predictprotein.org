import { useQuery } from "react-query";

import { FeatureRequest, fetch_features } from "../utils/api";
import { Notification, useNotifcationStore } from "../stores/notificationStore";
import useSequence from "./useSequence";

export function useFeatures(select) {
    const { data, isSuccess } = useSequence();

    const pushNotification = useNotifcationStore(
        (state) => state.pushNotification
    );

    const request = new FeatureRequest(data?.sequence);

    const sequenceQuery = useQuery({
        queryKey: ["features", data?.sequence],
        queryFn: () => fetch_features(request),
        staleTime: "Infinity",
        refetchOnWindowFocus: false,
        enabled: isSuccess,
        retry: 3,
        onError: (error) => {
            pushNotification(
                new Notification(
                    error.message,
                    "error",
                    "Error fetching Features"
                )
            );
        },
        select: select,
    });

    return sequenceQuery;
}
