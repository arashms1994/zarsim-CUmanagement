import type DateObject from "react-date-object";

export interface ITabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}

export interface IMaterialCategory {
  id: number;
  value: string;
}

export interface IPersianDatePickerProps {
  onChange: (date: string) => void;
  value: string | Date | DateObject | null;
}

export interface IProductionPlanRowFormProps {
  index?: number;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  planItem: IDarkhastMavadListItem;
  onSubmit?: (
    data: IExitFormProps,
    planItem: IDarkhastMavadListItem,
    index: number
  ) => Promise<{ success: boolean; message: string }>;
}

export interface IExitFormProps {
  firstName: string;
  productionPlanNumber: string;
  materialCategories: string;
  materialName: string;
  supplier: string;
  selectedMachine: string;
  materialPacking: string;
  materialWeight: string;
  materialPackingCount: string;
  responsible: string;
  materialExitDate: string;
  isCharge: boolean;
}

export interface IEnterFormInput {
  firstName: string;
  productionPlanNumber: string;
  materialCategories: string;
  materialName: string;
  supplier: string;
  selectedMachine: string;
  materialWeight: string;
  responsible: string;
  materialEnterDate: string;
}

export interface IDarkhastMavadListItem {
  AuthorId: number;
  ContentTypeId: string;
  Created: string;
  EditorId: number;
  FileSystemObjectType: number;
  GUID: string;
  ID: number;
  Id: number;
  KalaCCod: string;
  Modified: string;
  OData__UIVersionString: string;
  OData__x067e__x0627__x06a9__x06a9__x06: number;
  OData__x0645__x0642__x062f__x0627__x06: number;
  Title: string;
  codekala: string;
  codemahsol: string;
  codetamin: string;
  dastemavadi: string;
  dastghah: string;
  elatadameentebagh: null;
  excle: boolean;
  factorname: string;
  idbarname: null;
  marhaleha: string;
  meghdarbarnamerikol: null;
  meghdarcontrol: null;
  meghdardarkhast: string;
  meghdartahvili: string;
  namemoshtari: string;
  radvahedtolid: boolean;
  request_stock_material: boolean;
  rizmavad: string;
  shakhsetahvilgirande: null;
  sharj: boolean;
  shomareradifdarkhast: string;
  shpmarebarname: string;
  taidevahedekontrol: boolean;
  tamin: string;
  test: null;
  time: string;
  tojihatkontroltolid: null;
  tozihat: null;
}

export interface ISupplierItem {
  ID: number;
  Supplier: string;
}

export interface IDevicesItem {
  ID: number;
  Title: string;
}

export interface IPersonnelItem {
  ID: number;
  Title: string;
}

export interface IMaterialProductionListItem {
  Title: string;
  Material_Category: string;
  Material_Name: string;
  Material_Supplier: string;
  Request_Date: string;
  Date: string;
  Amount: string;
  Inventory: string;
  Device: string;
  Phase: string;
  Request_Row: string;
  Responsible: string;
}

export interface IMaterialChargeListItem {
  Title: string;
  Enterance_Date: string;
  Exit_Date: string;
  Inventory: string;
  Exit_Amount: string;
  Device: string;
  Request_Row: string;
  Phase: string;
  Material_Category: string;
  Material_Name: string;
  Material_Supplier: string;
  Request_Date: string;
  Enter_Responsible: string;
  Exit_Responsible: string;
}
