import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import rpx, { vmax } from "@/utils/rpx";
import { fontSizeConst } from "@/constants/uiConst";
import useColors from "@/hooks/useColors";

import ThemeText from "@/components/base/themeText";
import { ScrollView } from "react-native-gesture-handler";
import PanelBase from "../base/panelBase";
import { dismissPanel, hidePanel } from "../usePanel";
import PanelHeader from "../base/panelHeader";
import { useI18N } from "@/core/i18n";
import useOrientation from "@/hooks/useOrientation";
import Dialog from "@/components/dialogs/components/base";
import { TVColors } from "@/constants/tvTheme";

interface ISimpleInputProps {
    title?: string;
    onOk: (text: string, closePanel: () => void) => void;
    hints?: string[];
    onCancel?: () => void;
    maxLength?: number;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function SimpleInput(props: ISimpleInputProps) {
    const { t } = useI18N();
    const {
        onOk,
        onCancel,
        placeholder,
        maxLength = 80,
        hints,
        title,
        autoFocus,
    } = props;

    const [input, setInput] = useState("");
    const [inputFocused, setInputFocused] = useState(false);
    const colors = useColors();
    const orientation = useOrientation();

    const close = () => {
        onCancel?.();
        if (orientation === "horizontal") {
            dismissPanel();
        } else {
            hidePanel();
        }
    };

    const inputControl = (
        <TextInput
            value={input}
            accessible
            autoFocus={autoFocus ?? orientation === "vertical"}
            hasTVPreferredFocus={orientation === "horizontal"}
            accessibilityLabel={t("panel.simpleInput.inputLabel")}
            accessibilityHint={placeholder}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onChangeText={setInput}
            style={[
                style.input,
                orientation === "horizontal" && style.tvInput,
                {
                    color: colors.text,
                    backgroundColor: colors.placeholder,
                },
                inputFocused && style.inputFocused,
            ]}
            placeholderTextColor={colors.textSecondary}
            placeholder={placeholder ?? ""}
            maxLength={maxLength}
        />
    );

    const hintContent = hints?.length ? (
        <View style={style.hints}>
            {hints.map((hint, index) => (
                <ThemeText
                    key={`hint-index-${index}`}
                    style={style.hintLine}
                    fontSize="subTitle"
                    fontColor="textSecondary">
                    ￮ {hint}
                </ThemeText>
            ))}
        </View>
    ) : null;

    if (orientation === "horizontal") {
        return (
            <Dialog onDismiss={close} containerStyle={style.tvDialog}>
                <Dialog.Title withDivider>{title || ""}</Dialog.Title>
                <Dialog.Content style={style.tvContent}>
                    <ThemeText
                        style={style.tvLabel}
                        fontSize="content"
                        fontWeight="medium">
                        {placeholder || t("panel.simpleInput.inputLabel")}
                    </ThemeText>
                    {inputControl}
                    {hintContent}
                </Dialog.Content>
                <Dialog.Actions
                    actions={[
                        {
                            title: t("common.cancel"),
                            onPress: close,
                        },
                        {
                            title: t("common.confirm"),
                            type: "primary",
                            onPress: () => onOk(input, dismissPanel),
                        },
                    ]}
                />
            </Dialog>
        );
    }

    return (
        <PanelBase
            keyboardAvoidBehavior="height"
            height={vmax(30)}
            renderBody={() => (
                <>
                    <PanelHeader
                        title={title || ""}
                        onCancel={close}
                        onOk={async () => {
                            onOk(input, hidePanel);
                        }}
                    />

                    {inputControl}
                    <ScrollView>
                        {hintContent}
                    </ScrollView>
                </>
            )}
        />
    );
}

const style = StyleSheet.create({
    wrapper: {
        width: rpx(750),
    },
    opeartions: {
        width: rpx(750),
        paddingHorizontal: rpx(24),
        flexDirection: "row",
        height: rpx(100),
        alignItems: "center",
        justifyContent: "space-between",
    },
    input: {
        margin: rpx(24),
        borderRadius: rpx(12),
        borderWidth: 3,
        borderColor: "transparent",
        fontSize: fontSizeConst.content,
        lineHeight: fontSizeConst.content * 1.5,
        padding: rpx(12),
    },
    inputFocused: {
        borderColor: TVColors.focus,
    },
    tvDialog: {
        width: "58%",
        maxWidth: rpx(900),
    },
    tvContent: {
        paddingHorizontal: rpx(36),
        paddingVertical: rpx(32),
    },
    tvLabel: {
        marginBottom: rpx(16),
    },
    tvInput: {
        minHeight: rpx(76),
        margin: 0,
        paddingHorizontal: rpx(20),
    },
    hints: {
        marginTop: rpx(24),
        paddingHorizontal: rpx(24),
    },
    hintLine: {
        marginBottom: rpx(12),
    },
});
