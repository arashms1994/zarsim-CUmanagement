/* eslint-disable @typescript-eslint/no-explicit-any */
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
  device: string;
}

export interface IProductListItem {
  FileSystemObjectType: number;
  Id: number;
  ID: number;
  ContentTypeId: string;
  Title: string;
  code: number;
  Category: string;
  AuthorId: number;
  EditorId: number;
  Created: string;
  Modified: string;
  WFCreate: string | null;
  ProductCode: string;
  Status: string | null;
  Feasibility: string | null;
  Voltage: string;
  Structure: string;
  Color0: string | null;
  Description: string | null;
  ProductName: string;
  ProductType: string;
  PureName: string;
  WFPureNa: number;
  String: number;
  StringOfSize: string | null;
  SectionOfSize: string | null;
  UnitOfSize: string | null;
  ConductorSection: string | null;
  ConductorString: string | null;
  UnitOfConductor: string | null;
  TechnicalNameOfVehicle: string;
  NameOfVehicle: string | null;
  TypeOfVehicle: string | null;
  PersianID: string;
  LatinID: string;
  TechnicalSize: string;
  StirngNumberOfPower: number;
  PhaseSection: string;
  NullSection: string | null;
  WatSection: string | null;
  Screen: string | null;
  VoltageLevel: string;
  SpecialFeature: string | null;
  TechnicalNameOfPower: string;
  TypeOfPower: string;
  TechnicalDescriptionOfPower: string;
  NameOfPower: string;
  TechnicalDescription0: string | null;
  TypeOfConductor: string | null;
  MaterialOfConductor: string | null;
  NameOfConductor: string | null;
  ProductionPlanOfConductor: string | null;
  SizeStringOfConductor: string | null;
  SizeSectionOfConductor: string | null;
  SizeUnitOfConductor: string | null;
  SectionNumberOfConductor: string | null;
  StringNumberOfConductor: string | null;
  ConductorUnit: string | null;
  TechnicalNAmeOfConductor: string;
  TechnicalNumberOfConductor: string | null;
  StructureOfPower: string;
  Multiple: string | null;
  OData__x0053_um1: string | null;
  OData__x0053_um2: string | null;
  Slash: string | null;
  Unit: string;
  MultipleOfConductor1: string | null;
  ConductorDash1: string | null;
  MultipleOfConductor2: string | null;
  ConductorDash2: string | null;
  ConductorDash3: string | null;
  Dash1: string;
  Dash2: string;
  Dash3: string;
  Dash4: string | null;
  Dash: string;
  Multiple1: string | null;
  Multiple2: string | null;
  Unit1: string;
  Unit2: string | null;
  TypeOfInstrumentationAndControl: string | null;
  PersianIDOfInstrumentation: string | null;
  LatinIDOfInstrumentation: string | null;
  VoltageLevelOfInstrumentation: string | null;
  SpecialFeaturesOfInstrumentation: string | null;
  TechnicalNameOfInstrumentation: string | null;
  TechnicalSizeOfInstrumentation: string | null;
  TechnicalSizaOfControl: string | null;
  StringNumberOfInstrumentation: string | null;
  UnitOfInstrumentation: string | null;
  SectionOfInstrumentation: string | null;
  SectionUnitOfInstrumentation: string | null;
  StructureOfInstrumentation: string | null;
  NameOfInstrumentation: string | null;
  SizeOfInstrumentation: string | null;
  TechnicalDescriptionOfInstrument: string | null;
  Multiple3: string;
  DescriptionOfConductor0: string | null;
  TypeOfTelecommunicationCables: string | null;
  NameOfTelecommunicationCables: string | null;
  PersianIDOfTelecommunicationCabl: string | null;
  LatinIDOfTelecommunicationCables: string | null;
  SizeOfTelecommunicationCables: string | null;
  StructureOfTelecommunicationCabl: string | null;
  TechnicalDescriptionOfTelecommun: string | null;
  SpecialFeaturesOfTelecommunicati: string | null;
  TechnicalNameOfTelecommunication: string | null;
  StringNumberOfTelecommunicationC: string | null;
  UnitOfTelecommunicationCables: string | null;
  DiameterOfTelecommunicationCable: string | null;
  UnitOfTelecommunicationCables2: string | null;
  TypeOfAluminium: string | null;
  NameOfAluminium: string | null;
  PersianIDOfAluminium: string | null;
  LatinIDOfAluminium: string | null;
  StringNumberOfAluminium: string | null;
  PhaseSectionOfAluminium: string | null;
  NoulSectionOfAluminium: string | null;
  BrightnessSectionOfAluminium: string | null;
  InhibitionSectionOfAluminium: string | null;
  UnitOfAluminium: string | null;
  SizeOfAluminium: string | null;
  StructureOfAluminium: string | null;
  SpecialFeaturesOfAluminium: string | null;
  TechnicalDescriptionOfAluminium: string | null;
  TechnicalNameOfAluminium: string | null;
  VoltageLevelOfAluminium: string | null;
  LatinSpecialFeaturesOfAluminium: string;
  Products: string;
  Customer: string | null;
  Dash5: string | null;
  Dash6: string | null;
  SearchProduct: string | null;
  Name: string | null;
  Type: string;
  field1: string | null;
  field2: string;
  tedadrang: string | null;
  OData__x0627__x06cc__x062c__x0627__x06: number;
  rangamade: string | null;
  OData__x067e__x06cc__x062f__x0627__x06: number;
  sharhmahsolbarayefactor: string;
  color_code_defalte: string | null;
  code_moadian: string;
  vahedshomaresh: string;
  codegroh: string;
  onvangroup: string;
  tesadreshte: string | null;
  maghta: string | null;
  tesadreshte2: string | null;
  maghta2: string | null;
  tesadreshte3: string | null;
  maghta3: string | null;
  OData__UIVersionString: string;
  Attachments: boolean;
  GUID: string;
}

