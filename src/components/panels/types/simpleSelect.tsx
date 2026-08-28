import React, { Fragment } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import rpx from "@/utils/rpx";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PanelBase from "../base/panelBase";
import { dismissPanel, hidePanel } from "../usePanel";
import ListItem from "@/components/base/listItem";
import PanelHeader from "../base/panelHeader";
import useOrientation from "@/hooks/useOrientation";
import Dialog from "@/components/dialogs/components/base";
import { TVColors, TVMetrics } from "@/constants/tvTheme";

interface ICandidateItem {
    title?: string;
    value: any;
}

interface ISimpleSelectProps {
    height?: number;
    header?: string;
    candidates?: Array<ICandidateItem>;
    onPress?: (item: ICandidateItem) => void;
}

export default function SimpleSelect(props: ISimpleSelectProps) {
    const {
        height = rpx(520),
        header = "",
        candidates = [],
        onPress,
    } = props ?? {};

    const safeAreaInsets = useSafeAreaInsets();
    const orientation = useOrientation();

    if (orientation === "horizontal") {
        return (
            <Dialog onDismiss={dismissPanel} containerStyle={styles.tvDialog}>
                <Dialog.Title withDivider>{header}</Dialog.Title>
                <Dialog.Content style={styles.tvContent}>
                    <ScrollView
                        style={styles.tvScroll}
                        contentContainerStyle={styles.tvGrid}>
                        {candidates.map((it, index) => (
                            <View
                                key={`candidate-${index}`}
                                style={styles.tvOption}>
                                <ListItem
                                    heightType="small"
                                    withHorizontalPadding
                                    hasTVPreferredFocus={index === 0}
                                    onPress={() => {
                                        dismissPanel();
                                        onPress?.(it);
                                    }}>
                                    <ListItem.Content
                                        title={it.title ?? it.value}
                                    />
                                </ListItem>
                            </View>
                        ))}
                    </ScrollView>
                </Dialog.Content>
            </Dialog>
        );
    }

    return (
        <PanelBase
            height={height}
            renderBody={() => (
                <>
                    <PanelHeader title={header} hideButtons />

                    <ScrollView
                        style={[
                            styles.body,
                            { marginBottom: safeAreaInsets.bottom },
                        ]}>
                        {candidates.map((it, index) => {
                            return (
                                <Fragment key={`frag-${index}`}>
                                    <ListItem
                                        heightType="small"
                                        withHorizontalPadding
                                        onPress={() => {
                                            onPress?.(it);
                                            hidePanel();
                                        }}>
                                        <ListItem.Content
                                            title={it.title ?? it.value}
                                        />
                                    </ListItem>
                                </Fragment>
                            );
                        })}
                    </ScrollView>
                </>
            )}
        />
    );
}

const styles = StyleSheet.create({
    tvDialog: {
        width: "52%",
        maxWidth: rpx(800),
        overflow: "hidden",
    },
    tvContent: {
        paddingHorizontal: rpx(12),
        paddingVertical: rpx(12),
    },
    tvScroll: {
        maxHeight: rpx(240),
    },
    tvGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: rpx(12),
    },
    tvOption: {
        flexBasis: "48%",
        flexGrow: 1,
        maxWidth: "49%",
        height: rpx(88),
        borderRadius: TVMetrics.radius,
        borderWidth: 1,
        borderColor: TVColors.soft,
        backgroundColor: TVColors.raised,
        overflow: "hidden",
    },
    header: {
        width: "100%",
        flexDirection: "row",
        padding: rpx(24),
    },
    body: {
        flex: 1,
    },
    item: {
        height: rpx(96),
        justifyContent: "center",
    },
});
