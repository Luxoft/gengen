import { IExtendedInterfaceModel, InterfaceModel } from '../../models/InterfaceModel';

export function isIExtendedInterfaceModel(objects: InterfaceModel): objects is IExtendedInterfaceModel {
    return Boolean((objects as IExtendedInterfaceModel)?.extendingInterfaces);
}
