import * as React from 'react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import storeMatch from '../../storeMatch';
import { bindMatchStorage } from '../../stores/withMatchStorage';

const actionProps = (inProgressMatchStore: InProgressMatchStore, isAuthenticated: boolean, getUserId: () => string) => {
    const bindStorage = bindMatchStorage(
        storeMatch(isAuthenticated, inProgressMatchStore.setId),
        () => inProgressMatchStore,
        getUserId,
    );
    return bindStorage({
        delivery: inProgressMatchStore.delivery,
        undoPreviousDelivery: inProgressMatchStore.undoPreviousDelivery,
        completeOver: inProgressMatchStore.completeOver,
        changeEnds: inProgressMatchStore.flipBatters,
        completeInnings: inProgressMatchStore.completeInnings,
        completeMatch: inProgressMatchStore.completeMatch,
        batterUnavailable: inProgressMatchStore.batterUnavailable,
        updateOvers: inProgressMatchStore.updateOvers,
        startBreak: inProgressMatchStore.startBreak,
        undoToss: inProgressMatchStore.undoToss,
        changeBowler: inProgressMatchStore.changeBowler,
    });
};

export default (Component: any) => (props: any) => (
    <Component
        {...props}
        {...actionProps(props.inProgressMatchStore, props.isAuthenticated, () => props.userProfile.id)}
    />
);
