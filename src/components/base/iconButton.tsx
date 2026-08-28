import React from "react";
import { ColorKey, colorMap, iconSizeConst } from "@/constants/uiConst";
import { StyleSheet } from "react-native";
import useColors from "@/hooks/useColors";
import { SvgProps } from "react-native-svg";
import Icon, { IIconName } from "@/components/base/icon.tsx";
import TVPressable from "@/components/tv/TVPressable";

interface IIconButtonProps extends SvgProps {
    name: IIconName;
    style?: SvgProps["style"];
    sizeType?: keyof typeof iconSizeConst;
    fontColor?: ColorKey;
    color?: string;
    onPress?: () => void;
    accessibilityLabel?: string;
    hasTVPreferredFocus?: boolean;
}
export function IconButtonWithGesture(props: IIconButtonProps) {
    return <IconButton {...props} />;
}

export default function IconButton(props: IIconButtonProps) {
    const {
        sizeType = "normal",
        fontColor = "normal",
        style,
        color,
        onPress,
        name,
        accessibilityLabel,
        hasTVPreferredFocus,
        ...iconProps
    } = props;
    const colors = useColors();
    const size = iconSizeConst[sizeType];
    const icon = (
        <Icon
            {...iconProps}
            accessible={!onPress}
            accessibilityLabel={!onPress ? accessibilityLabel : undefined}
            name={name}
            color={color ?? colors[colorMap[fontColor]]}
            style={[{ minWidth: size }, styles.textCenter]}
            size={size}
        />
    );

    if (!onPress) {
        return icon;
    }

    return (
        <TVPressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            hasTVPreferredFocus={hasTVPreferredFocus}
            onPress={onPress}
            style={[styles.button, style as any]}>
            {icon}
        </TVPressable>
    );
}

const styles = StyleSheet.create({
    textCenter: {
        height: "100%",
        textAlignVertical: "center",
    },
    button: {
        width: 58,
        height: 58,
        alignItems: "center",
        justifyContent: "center",
    },
});
