import React, { useEffect, useMemo, useState } from "react";
import { Image, ImageProps } from "react-native";

interface IImageProps extends ImageProps {
    uri?: string | null;
    emptySrc?: any;
}
export default function (props: Omit<IImageProps, "source">) {
    const { uri, emptySrc, onError, ...imageProps } = props;
    const normalizedUri = useMemo(
        () => (typeof uri === "string" ? uri.trim() : ""),
        [uri],
    );
    const [failedUri, setFailedUri] = useState<string>();

    useEffect(() => {
        setFailedUri(undefined);
    }, [normalizedUri]);

    const useFallback = !normalizedUri || failedUri === normalizedUri;

    return (
        <Image
            {...imageProps}
            source={useFallback ? emptySrc : { uri: normalizedUri }}
            onError={event => {
                if (normalizedUri) {
                    setFailedUri(normalizedUri);
                }
                onError?.(event);
            }}
        />
    );
}
