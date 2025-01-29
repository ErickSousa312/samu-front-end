// svg.d.ts ou custom.d.ts
declare module "*.svg" {
  import { FunctionComponent, SVGProps } from "react";

  const content: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default content;
}
