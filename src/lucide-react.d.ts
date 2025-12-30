declare module "lucide-react" {
  import { FC, SVGProps } from "react";

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export const CheckIcon: FC<IconProps>;
  export const ChevronDownIcon: FC<IconProps>;
  export const ChevronUpIcon: FC<IconProps>;
  export const CalendarSearch: FC<IconProps>;
  export const X: FC<IconProps>;
  export const Loader2: FC<IconProps>;
  export const CircleCheckIcon: FC<IconProps>;
  export const InfoIcon: FC<IconProps>;
  export const Loader2Icon: FC<IconProps>;
  export const OctagonXIcon: FC<IconProps>;
  export const TriangleAlertIcon: FC<IconProps>;
}
