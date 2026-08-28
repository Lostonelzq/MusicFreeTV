import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import rpx, { vmax } from "@/utils/rpx";
import useColors from "@/hooks/useColors";

import ThemeText from "@/components/base/themeText";
import { ScrollView } from "react-native-gesture-handler";
import PanelBase from "../base/panelBase";
import { dismissPanel, hidePanel } from "../usePanel";
import ListItem from "@/components/base/listItem";
import Input from "@/components/base/input";
import globalStyle from "@/constants/globalStyle";
import PanelHeader from "../base/panelHeader";
import useOrientation from "@/hooks/useOrientation";
import Dialog from "@/components/dialogs/components/base";
import { TVColors } from "@/constants/tvTheme";
import { useI18N } from "@/core/i18n";

interface IUserVariablesProps {
    title?: string;
    onOk: (values: Record<string, string>, closePanel: () => void) => void;
    variables: IPlugin.IUserVariable[];
    initValues?: Record<string, string>;
    onCancel?: () => void;
}

export default function SetUserVariables(props: IUserVariablesProps) {
    const { onOk, onCancel, variables, initValues = {}, title } = props;

    const colors = useColors();
    const orientation = useOrientation();
    const { t } = useI18N();
    const [focusedVariable, setFocusedVariable] = useState<string | null>(null);

    const resultRef = useRef({ ...initValues });

    const close = () => {
        onCancel?.();
        if (orientation === "horizontal") {
            dismissPanel();
        } else {
            hidePanel();
        }
    };

    if (orientation === "horizontal") {
        return (
            <Dialog onDismiss={close} containerStyle={styles.tvDialog}>
                <Dialog.Title withDivider>
                    {title ?? "设置用户变量"}
                </Dialog.Title>
                <Dialog.Content style={styles.tvContent}>
                    <ScrollView
                        style={styles.tvScroll}
                        contentContainerStyle={styles.tvFields}
                        keyboardShouldPersistTaps="handled">
                        {variables.map(it => (
                            <View key={it.key} style={styles.tvField}>
                                <ThemeText
                                    style={styles.tvLabel}
                                    fontSize="content"
                                    fontWeight="medium">
                                    {it.name ?? it.key}
                                </ThemeText>
                                <Input
                                    accessible
                                    accessibilityLabel={it.name ?? it.key}
                                    accessibilityHint={it.hint}
                                    defaultValue={initValues[it.key]}
                                    onFocus={() => setFocusedVariable(it.key)}
                                    onBlur={() => setFocusedVariable(null)}
                                    onChangeText={value => {
                                        resultRef.current[it.key] = value;
                                    }}
                                    style={[
                                        styles.tvInput,
                                        {
                                            color: colors.text,
                                            backgroundColor: colors.placeholder,
                                        },
                                        focusedVariable === it.key &&
                                            styles.tvInputFocused,
                                    ]}
                                    placeholder={it.hint}
                                />
                                {it.hint ? (
                                    <ThemeText
                                        style={styles.tvHint}
                                        fontColor="textSecondary">
                                        {it.hint}
                                    </ThemeText>
                                ) : null}
                            </View>
                        ))}
                    </ScrollView>
                </Dialog.Content>
                <Dialog.Actions
                    actions={[
                        {
                            title: t("common.cancel"),
                            hasTVPreferredFocus: true,
                            onPress: close,
                        },
                        {
                            title: t("common.confirm"),
                            type: "primary",
                            onPress: () =>
                                onOk(resultRef.current, dismissPanel),
                        },
                    ]}
                />
            </Dialog>
        );
    }

    return (
        <PanelBase
            height={vmax(80)}
            positionMethod='top'
            keyboardAvoidBehavior='none'
            renderBody={() => (
                <>
                    <PanelHeader
                        title={title ?? "设置用户变量"}
                        onCancel={close}
                        onOk={async () => {
                            onOk(resultRef.current, hidePanel);
                        }}
                    />
                    <KeyboardAvoidingView
                        behavior="padding"
                        style={globalStyle.flex1}>
                        <ScrollView
                            contentContainerStyle={{
                                paddingBottom: vmax(20),
                            }}>
                            {variables.map(it => (
                                <ListItem
                                    key={it.key}
                                    withHorizontalPadding
                                    style={styles.listItem}>
                                    <ThemeText
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={styles.varName}>
                                        {it.name ?? it.key}
                                    </ThemeText>
                                    <Input
                                        defaultValue={initValues[it.key]}
                                        onChangeText={e => {
                                            resultRef.current[it.key] = e;
                                        }}
                                        style={[
                                            styles.input,
                                            {
                                                backgroundColor:
                                                    colors.placeholder,
                                            },
                                        ]}
                                        placeholder={it.hint}
                                    />
                                </ListItem>
                            ))}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </>
            )}
        />
    );
}

const styles = StyleSheet.create({
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
    listItem: {
        justifyContent: "space-between",
    },
    varName: {
        maxWidth: "35%",
    },
    input: {
        width: "50%",
        paddingVertical: rpx(8),
        paddingHorizontal: rpx(12),
        borderRadius: rpx(8),
    },
    tvDialog: {
        width: "58%",
        maxWidth: rpx(900),
        overflow: "hidden",
    },
    tvContent: {
        paddingHorizontal: rpx(36),
        paddingVertical: rpx(28),
    },
    tvScroll: {
        maxHeight: rpx(360),
    },
    tvFields: {
        gap: rpx(24),
    },
    tvField: {
        width: "100%",
    },
    tvLabel: {
        marginBottom: rpx(12),
    },
    tvInput: {
        width: "100%",
        minHeight: rpx(76),
        borderRadius: rpx(12),
        borderWidth: 3,
        borderColor: "transparent",
        paddingHorizontal: rpx(20),
        paddingVertical: rpx(12),
    },
    tvInputFocused: {
        borderColor: TVColors.focus,
    },
    tvHint: {
        marginTop: rpx(10),
        lineHeight: rpx(26),
    },
});
