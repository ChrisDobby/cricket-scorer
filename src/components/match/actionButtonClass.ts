import { DeliveryOutcome } from '../../domain';

const actionButtonClass = (invalidClassName: string) => (deliveryOutcome: DeliveryOutcome) =>
    deliveryOutcome === DeliveryOutcome.Noball || deliveryOutcome === DeliveryOutcome.Wide
        ? invalidClassName
        : undefined;

export default actionButtonClass('btn-danger');
