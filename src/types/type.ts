import type DateObject from "react-date-object";

export interface ITabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}

export interface IProductsTableProps {
  items: ISubProductionPlanListItem[];
  isLoading: boolean;
  control?: any;
  actualAmountProduction?: string;
  waste?: string;
  setValue?: (name: string, value: any, options?: any) => void;
  onTotalsChange?: (totals: {
    ordersTotalWeight: string;
    ordersTotalAmount: string;
  }) => void;
}

export interface IMaterialCategory {
  id: number;
  value: string;
}

export interface IPersianDatePickerProps {
  onChange: (date: string) => void;
  value: string | Date | DateObject | null;
}

export interface IStopReasonSelectorProps {
  stopReason: string;
  onStopReasonChange: (value: string) => void;
  control: any;
  onStopItemChange?: (stopItem: IStopListItem | null) => void;
}

export interface IOperatorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onShiftChange?: (shift: {
    id: number | "";
    title: string;
    start: string;
    end: string;
  }) => void;
}

export interface IDeviceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  marhale?: string;
  onDeviceChange?: (device: { id: number; title: string }) => void;
}

export interface IProductionPlanRowFormProps {
  index?: number;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  planItem: IPrintTajmiListItem;
  control?: any;
  productionPlanNumber?: string;
  selectedStage?: string;
  onSubmit?: (
    data: ICUManagementFormProps,
    planItem: IPrintTajmiListItem,
    index: number
  ) => Promise<{ success: boolean; message: string }>;
}

export interface ICUManagementFormProps {
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
  actualAmountProduction?: string;
  actualWeight?: string;
  stopTime?: string;
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

export interface IDevicesListItem {
  ID: number;
  Title: string;
  Level: string;
  dastebandi: string;
  Report: string;
  FullNmae: string;
  DeviceCode: string;
  Status: string;
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

export interface ISubProductionPlanListItem {
  FileSystemObjectType: number;
  Priority: string;
  Id: number;
  ContentTypeId: string;
  Title: string;
  meghdartoliddaremroz: number;
  meghdarkolesefaresh: number;
  shomareradiffactor: string;
  namedastghah: string;
  namemarhale: string;
  shomarebarnamerizi: string;
  nameoperator: string | null;
  namemoshtari: string;
  size: string;
  tarhetolid: string;
  vijegihayekhas: string | null;
  productionplanid: string | null;
  codemahsol: string;
  sizeghaleb: string;
  toltabmax: string | null;
  toltabmin: string | null;
  jahattab: string | null;
  mahsoletolidi: string;
  tozihat: string;
  tarikhbarnamerizi: string;
  barnameriziaztarike: string;
  barnamerizitatarikhe: string;
  minghotrershte: string | null;
  maxghotrershte: string | null;
  tedadreshteshte: string | null;
  mintoltabmarkaz: string | null;
  maxtoltabmarkaz: string | null;
  chidemanreshtelayeha: string | null;
  sizenazel: string;
  minghotreayeghshode: string | null;
  maxghotreayeghshode: string | null;
  rangbandi: string;
  zekhamatmotevaset: string;
  zekhamatnoghtei: string;
  ghotremaftolfoladi: string | null;
  tedadmaftolfoladi: string | null;
  poshesh: string | null;
  arzenavar: string | null;
  tedadarmor: string | null;
  rangrokesh: string | null;
  zaribtab: string | null;
  arzenavarmailar: string | null;
  zekhamatnavarmailar: string | null;
  arzenavaralminiom: string | null;
  zekhamatenavaralminiom: string | null;
  minrotobat: string | null;
  zamanotaghbokhar: string | null;
  sizesimert: string | null;
  mindama: string | null;
  idproductionPlanproductgroup1: number;
  shomareverjen: number;
  tolidvaghei: string | null;
  diff: number;
  estefademeghdar: number;
  estefadedar: string | null;
  akharinmazadtolid: number;
  meghdareestefadeshodeazdigharmaz: string | null;
  akharin_gerefteshodeazmaza: string | null;
  typesefaresh: string;
  typename: string;
  typeertorhadi: string | null;
  shomaremarhale: string;
  carttolid: boolean;
  shomarecart: string;
  matnechap: string;
  mavadbari: boolean;
  shomarebarnamemavad: string | null;
  tozihattolid: string | null;
  OData_takara: number;
  typekeshesh: string | null;
  OData_halate: string | null;
  idprint: string | null;
  OData_moghavemat: string | null;
  akharinmarhale: boolean;
  OData_tas: string | null;
  toltabmax2: string | null;
  toltabmax3: string | null;
  toltabmin2: string | null;
  toltabmin3: string | null;
  jahattab2: string | null;
  jahattab3: string | null;
  jahattabm: string | null;
  chidemanreshtelayeha2: string | null;
  chidemanreshtelayeha3: string | null;
  chidemanreshtelayeham: string | null;
  OData_perkar1: number;
  OData_perkar2: string | null;
  bastebandi: string | null;
  yyyyyy: string | null;
  ID: number;
  Modified: string;
  Created: string;
  AuthorId: number;
  EditorId: number;
  OData__UIVersionString: string;
  Attachments: boolean;
  GUID: string;
}

export interface IPrintTajmiListItem {
  FileSystemObjectType: number;
  Id: number;
  ContentTypeId: string;
  Title: string;
  shomaretajshode: string;
  shomaretahshode?: string;
  moshtari: string;
  meghdartolid: number;
  marhale: string;
  codemahsol: string;
  rang: string;
  dasatghah: string;
  meghdar: string | null;
  barnamerizi: number;
  payantolid: boolean;
  typekeshesh: string | null;
  OData_estekh: number;
  idBOM: string | null;
  shomaremarahel: string;
  darkhastmavadazanbar: string | null;
  jamhalat1: string | null;
  jamehalat2: string | null;
  jamhalat3: string | null;
  namehalat1: string | null;
  namehalat2: string | null;
  namehalat3: string | null;
  akharinmarhale: boolean;
  tojihat: string | null;
  def: number;
  test: string | null;
  OData_pakkak: number;
  radiffactor: string;
  sizeghale: string | null;
  OData_barresi: number;
  ID: number;
  Modified: string;
  Created: string;
  AuthorId: number;
  EditorId: number;
  OData__UIVersionString: string;
  Attachments: boolean;
  GUID: string;
}

export interface IStopListItem {
  Id: number;
  Title: string;
  Code: string;
}

export interface IReelListItem {
  Id: number;
  Title: string;
  Size?: string;
  Weight?: string;
}

export interface IReelItem {
  reelId: number;
  reelTitle: string;
  weight: string;
  amount: string;
}

export interface IReelSelectorProps {
  reels: IReelItem[];
  onReelsChange: (reels: IReelItem[]) => void;
  label: string;
}

export interface ICUManagementListItem {
  Title: string;
  actualAmountProduction: string;
  operator: string;
  productionPlanAmount: string;
  preInvoiceRow: string;
  stage: string;
  device: string;
  calculatedWeight: string;
  actualWeight: string;
  entranceWeight: string;
  waste: string;
  product: string;
  productCode: string;
  description: string;
  stopTitle: string;
  stopCode: string;
  stopTime: string;
  shiftTitle: string;
  shiftStartedAt: string;
  shiftEndedAt: string;
  shiftId: string;
  deviceId: string;
  ordersTotalWeight: string;
  ordersTotalAmount: string;
  Created: string;
  Modified: string;
  CreatedById: number;
  ModifiedById: number;
}

export interface IProductMaterialPerStage {
  FileSystemObjectType: number;
  Id: number;
  ContentTypeId: string;
  Title: string;
  materialname: string;
  vahed: number;
  tozihat: string | null;
  marhale: number;
  idproductionPlanproductgroup1: number;
  idproductionPlanlevel: number;
  percentageerror: number | null;
  RelatedIDLevelId: number;
  OData__x067e__x0631__x06a9__x0631__x06: string | null;
  faal: boolean;
  numberone: string;
  send_to_history: string;
  sendtohi: string | null;
  test: string;
  OData__x0627__x0641__x0632__x0648__x06: string | null;
  OData__x062a__x063a__x06cc__x06cc__x06: string | null;
  ID: number;
  Modified: string;
  Created: string;
  AuthorId: number;
  EditorId: number;
  OData__UIVersionString: string;
  Attachments: boolean;
  GUID: string;
}

export interface ICUManagementSubmitData {
  productionPlanNumber: string;
  actualAmountProduction: string;
  operator: string;
  productionPlanAmount: string;
  preInvoiceRow: string;
  stage: string;
  device: string;
  calculatedWeight: string;
  actualWeight: string;
  product: string;
  description: string;
  productCode: string;
  stopTitle: string;
  stopCode: string;
  stopTime: string;
  shiftTitle: string;
  shiftStartedAt: string;
  shiftEndedAt: string;
  shiftId: number | string;
  deviceId: string;
  entranceWeight: string;
  waste: string;
  ordersTotalWeight: string;
  ordersTotalAmount: string;
}

export interface ICUManagementRowListItem {
  Title: string;
  productionPlanItem: string;
  actualAmount: string;
  orderAmount: string;
  orderWeight: string;
  actualWeight: string;
  waste: string;
  product: string;
  productCode: string;
  priority: string;
  customer: string;
  level: string;
  levelNumber: string;
}
