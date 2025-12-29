import type { IProductMaterialPerStage } from "../types/type";

export function calculateMaterialPerStage(
  materials: IProductMaterialPerStage[],
  meghdarjahattolid: number,
  vahed: string,
  tarh?: string
): { cu: number; ticu: number } {
  if (vahed !== "متر") {
    return {
      cu: meghdarjahattolid,
      ticu: meghdarjahattolid,
    };
  }

  if (tarh && tarh !== "" && materials.length > 0) {
    let vaznemohasebe = 0;
    let vaznemohasebeticu = 0;

    for (let index = 0; index < materials.length; index++) {
      const material = materials[index];

      const materialnameTrimmed = material.materialname?.trim();
      const isCU =
        materialnameTrimmed === "CU" ||
        materialnameTrimmed?.toUpperCase() === "CU";
      const isTICU =
        materialnameTrimmed === "TICU" ||
        materialnameTrimmed?.toUpperCase() === "TICU";

      if (isCU) {
        const vahedValue = parseFloat(material.vahed.toString());
        vaznemohasebe += vahedValue;
      }

      if (isTICU) {
        const vahedValue = parseFloat(material.vahed.toString());
        vaznemohasebeticu += vahedValue;
      }
    }

    const cu = parseFloat(
      ((vaznemohasebe * meghdarjahattolid) / 1000).toFixed(2)
    );
    const ticu = parseFloat(
      ((vaznemohasebeticu * meghdarjahattolid) / 1000).toFixed(2)
    );

    return {
      cu,
      ticu,
    };
  }

  return {
    cu: meghdarjahattolid,
    ticu: meghdarjahattolid,
  };
}

export function calculateBahaMetr(
  vahedMetr: number,
  metrajTolid: number
): number {
  return parseFloat(
    (
      parseFloat(vahedMetr.toString()) * parseFloat(metrajTolid.toString())
    ).toFixed(2)
  );
}
