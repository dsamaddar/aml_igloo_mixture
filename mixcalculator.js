"use strict";

/* ============================================================
   CONSTANTS
============================================================ */

const FCMP_FAT = 26;
const BUTTER_OIL_FAT = 100;
const STANDARD_TOTAL_SOLIDS = 36.5;

/*
     Non-fat solid % used for dynamically-created adjustment
     materials (when FCMP or Butter Oil is not already part of
     the selected formula). These match the standard values
     used for FCMP/Butter Oil elsewhere in the formulas below.
*/

const FCMP_NON_FAT_SOLID = 69;
const BUTTER_OIL_NON_FAT_SOLID = 0;

/* ============================================================
   FORMULAS
============================================================ */

const FORMULAS = {
  "MIX-1": [
    {
      name: "FCMP",
      percentage: 9.616,
      fatPercentage: 26,
      solidPercentage: 69,
      moisturePercentage: 5,
    },

    {
      name: "SMP",
      percentage: 4.133,
      fatPercentage: 1.0,
      solidPercentage: 96,
      moisturePercentage: 4,
    },

    {
      name: "V.FAT",
      percentage: 7.666,
      fatPercentage: 100,
      solidPercentage: 0,
      moisturePercentage: 0,
    },

    {
      name: "Stabilizer (Extruice 379/446/252)",
      percentage: 0.45,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Sugar",
      percentage: 15.333,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Glucose Syrup",
      percentage: 1.0,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Cream EMDI",
      percentage: 0.05,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Water",
      isBalance: true,
      fatPercentage: 0,
      solidPercentage: 0,
      moisturePercentage: 0,
    },
  ],
  "MIX-2": [
    {
      name: "SMP",
      percentage: 10.833,
      fatPercentage: 0,
      solidPercentage: 96,
      moisturePercentage: 4,
    },

    {
      name: "Butter Oil",
      percentage: 2.5,
      fatPercentage: 100,
      solidPercentage: 0,
      moisturePercentage: 0,
    },

    {
      name: "V.FAT",
      percentage: 7.666,
      fatPercentage: 100,
      solidPercentage: 0,
      moisturePercentage: 0,
    },

    {
      name: "Stabilizer (Extruice 379/446/252)",
      percentage: 0.45,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Sugar",
      percentage: 15.333,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Glucose Syrup",
      percentage: 1.0,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Cream EMDI",
      percentage: 0.05,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Water",
      isBalance: true,
      fatPercentage: 0,
      solidPercentage: 0,
      moisturePercentage: 0,
    },
  ],

  "MIX-3": [
    {
      name: "Fresh Milk",
      percentage: 62.5,
      fatPercentage: 3.8,
      isFreshMilk: true,
    },

    {
      name: "SMP",
      percentage: 5.672,
      fatPercentage: 0,
      solidPercentage: 96,
      moisturePercentage: 4,
    },

    {
      name: "V.FAT",
      percentage: 7.667,
      fatPercentage: 100,
      solidPercentage: 0,
      moisturePercentage: 0,
    },

    {
      name: "Stabilizer (Extruice 379/446/252)",
      percentage: 0.45,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Sugar",
      percentage: 15.333,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Glucose Syrup",
      percentage: 1.0,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Cream EMDI",
      percentage: 0.05,
      fatPercentage: 0,
      solidPercentage: 100,
      moisturePercentage: 0,
    },

    {
      name: "Water",
      isBalance: true,
      fatPercentage: 0,
      solidPercentage: 0,
      moisturePercentage: 0,
    },
  ],
};

/* ============================================================
   GLOBAL STATE
============================================================ */

let currentFormula = "MIX-1";

/* ============================================================
   INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  loadFormulaList();

  document
    .getElementById("formulaSelect")
    .addEventListener("change", changeFormula);

  document
    .getElementById("adjustmentMethod")
    .addEventListener("change", updateAdjustmentControls);

  document.getElementById("fcmpRatio").addEventListener("input", calculate);

  document.getElementById("targetFat").addEventListener("input", calculate);

  document.getElementById("freshMilkFat").addEventListener("input", calculate);

  document.getElementById("clrValue").addEventListener("input", calculate);

  document.getElementById("targetSolids").addEventListener("input", calculate);

  document.getElementById("batchSize").addEventListener("input", calculate);

  document
    .getElementById("decimalSelect")
    .addEventListener("change", calculate);

  loadFormula();

  updateAdjustmentControls();

  calculate();
});

/* ============================================================
   LOAD FORMULA DROPDOWN
============================================================ */

function loadFormulaList() {
  const select = document.getElementById("formulaSelect");

  select.innerHTML = "";

  Object.keys(FORMULAS).forEach(function (formulaName) {
    const option = document.createElement("option");

    option.value = formulaName;
    option.textContent = formulaName;

    select.appendChild(option);
  });

  select.value = currentFormula;
}

/* ============================================================
   CHANGE FORMULA
============================================================ */

function changeFormula() {
  currentFormula = document.getElementById("formulaSelect").value;

  loadFormula();

  calculate();
}

/* ============================================================
   GET FRESH MILK FAT
============================================================ */

function getFreshMilkFat() {
  const value = parseFloat(document.getElementById("freshMilkFat").value);

  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

/* ============================================================
   GET TARGET FAT
============================================================ */

function getTargetFat() {
  const value = parseFloat(document.getElementById("targetFat").value);

  if (Number.isNaN(value)) {
    return 10;
  }

  return Math.max(0, value);
}

/* ============================================================
   GET CLR (CORRECTED LACTO READING)
============================================================ */

function getCLR() {
  const value = parseFloat(document.getElementById("clrValue").value);

  if (Number.isNaN(value)) {
    return 28.5;
  }

  return Math.max(0, value);
}

/* ============================================================
   GET TARGET TOTAL SOLIDS
============================================================ */

function getTargetSolids() {
  const value = parseFloat(document.getElementById("targetSolids").value);

  if (Number.isNaN(value)) {
    return STANDARD_TOTAL_SOLIDS;
  }

  return Math.max(0, value);
}

/* ============================================================
   CALCULATE SNF (SOLIDS-NOT-FAT)

   SNF = (Milk Fat / 5) + (CLR / 4) + 0.14

   Milk Fat here is the Fresh Milk's own fat percentage
   (as entered in "Fresh Milk Fat %"), and CLR is the
   Corrected Lacto Reading of that milk.
============================================================ */

function calculateSNF(milkFat, clr) {
  return milkFat / 5 + clr / 4 + 0.14;
}

/* ============================================================
   MATERIAL TOTAL SOLID %

   Each material's own Total Solid % = its Fat % + its
   non-fat Solid % (the "solidPercentage" field already stored
   on the formula data, e.g. Sugar/Stabilizer = 100, SMP = 96,
   V.FAT/Butter Oil = 0). For Fresh Milk, the non-fat solid %
   is the SNF calculated from its fat % and CLR.
============================================================ */

function getMaterialTotalSolid(item) {
  const fat = item.fatPercentage || 0;

  const nonFatSolid = item.solidPercentage || 0;

  return fat + nonFatSolid;
}

/* ============================================================
   BUILD CURRENT FORMULA
============================================================ */

function buildCurrentFormula() {
  const source = FORMULAS[currentFormula];

  const formula = source.map(function (item) {
    return {
      ...item,
    };
  });

  /* --------------------------------------------------------
       Update Fresh Milk fat from user input
    -------------------------------------------------------- */

  formula.forEach(function (item) {
    if (item.isFreshMilk) {
      item.fatPercentage = getFreshMilkFat();

      /*
               Fresh Milk's non-fat solid % is its SNF,
               calculated from its own fat % and the entered
               CLR — not a fixed literature value like the
               other materials.
            */

      item.solidPercentage = calculateSNF(item.fatPercentage, getCLR());
    }
  });

  /* --------------------------------------------------------
       Determine if formula contains Fresh Milk
    -------------------------------------------------------- */

  const hasFreshMilk = formula.some(function (item) {
    return item.isFreshMilk;
  });

  /*
       If there is no Fresh Milk, no automatic fat
       standardization is required.
    */

  if (!hasFreshMilk) {
    calculateWaterBalance(formula);

    return formula;
  }

  /* --------------------------------------------------------
       Fat adjustment
    -------------------------------------------------------- */

  const adjustmentMethod = document.getElementById("adjustmentMethod").value;

  /*
       Remove any dynamically added adjustment materials.
    */

  const filteredFormula = formula.filter(function (item) {
    return !item.isDynamicAdjustment;
  });

  let fcmp = filteredFormula.find(function (item) {
    return item.name === "FCMP";
  });

  let butterOil = filteredFormula.find(function (item) {
    return item.name === "Butter Oil";
  });

  /*
       If FCMP does not exist in the formula,
       create an adjustment FCMP row.
    */

  if (!fcmp && (adjustmentMethod === "fcmp" || adjustmentMethod === "both")) {
    fcmp = {
      name: "FCMP",
      percentage: 0,
      fatPercentage: FCMP_FAT,
      solidPercentage: FCMP_NON_FAT_SOLID,
      isDynamicAdjustment: true,
    };

    filteredFormula.push(fcmp);
  }

  /*
       If Butter Oil does not exist in the formula,
       create a Butter Oil adjustment row.
    */

  if (
    !butterOil &&
    (adjustmentMethod === "butter" || adjustmentMethod === "both")
  ) {
    butterOil = {
      name: "Butter Oil",
      percentage: 0,
      fatPercentage: BUTTER_OIL_FAT,
      solidPercentage: BUTTER_OIL_NON_FAT_SOLID,
      isDynamicAdjustment: true,
    };

    filteredFormula.push(butterOil);
  }

  /*
       Existing FCMP percentage should only be considered
       as a fixed percentage if FCMP is NOT the adjustment
       material.

       Therefore when FCMP is selected as an adjustment,
       its original percentage is replaced by the calculated
       percentage.
    */

  let fixedFat = 0;

  filteredFormula.forEach(function (item) {
    if (item.isBalance) {
      return;
    }

    if (
      item.name === "FCMP" &&
      (adjustmentMethod === "fcmp" || adjustmentMethod === "both")
    ) {
      return;
    }

    if (
      item.name === "Butter Oil" &&
      (adjustmentMethod === "butter" || adjustmentMethod === "both")
    ) {
      return;
    }

    fixedFat += (item.percentage * item.fatPercentage) / 100;
  });

  const targetFat = getTargetFat();

  /*
       Fat still required.
    */

  const requiredFat = targetFat - fixedFat;

  /*
       Reset adjustment quantities.
    */

  if (fcmp && (adjustmentMethod === "fcmp" || adjustmentMethod === "both")) {
    fcmp.percentage = 0;
  }

  if (
    butterOil &&
    (adjustmentMethod === "butter" || adjustmentMethod === "both")
  ) {
    butterOil.percentage = 0;
  }

  /*
       If the fixed ingredients already exceed target fat,
       do not create negative quantities.
    */

  if (requiredFat < -0.000001) {
    /*
           Leave adjustment ingredients at zero.
        */

    showMessage(
      "warning",
      "The fixed ingredients already provide " +
        formatNumber(fixedFat) +
        "% fat, which is higher than the target " +
        formatNumber(targetFat) +
        "%. The selected adjustment method cannot reduce fat.",
    );
  } else {
    hideMessage();

    /* ----------------------------------------------------
           FCMP ONLY
        ---------------------------------------------------- */

    if (adjustmentMethod === "fcmp") {
      if (fcmp) {
        /*
                   FCMP fat = FCMP quantity × 26 / 100

                   Therefore:

                   FCMP quantity =
                   required fat × 100 / 26
                */

        fcmp.percentage = (requiredFat * 100) / FCMP_FAT;
      }
    } else if (adjustmentMethod === "butter") {

    /* ----------------------------------------------------
           BUTTER OIL ONLY
        ---------------------------------------------------- */
      if (butterOil) {
        /*
                   Butter Oil is assumed to be 100% fat.
                */

        butterOil.percentage = (requiredFat * 100) / BUTTER_OIL_FAT;
      }
    } else if (adjustmentMethod === "both") {

    /* ----------------------------------------------------
           FCMP + BUTTER OIL
        ---------------------------------------------------- */
      const ratio = parseFloat(document.getElementById("fcmpRatio").value);

      const safeRatio = Number.isNaN(ratio)
        ? 70
        : Math.max(0, Math.min(100, ratio));

      /*
               Important:

               "FCMP Adjustment %" represents the
               percentage of the REQUIRED FAT contribution,
               not the percentage of material quantity.

               Example:

               Required fat = 2%

               FCMP share = 70%

               FCMP must provide 1.4% fat.

               Butter Oil must provide 0.6% fat.
            */

      const fcmpFatRequired = (requiredFat * safeRatio) / 100;

      const butterFatRequired = requiredFat - fcmpFatRequired;

      if (fcmp) {
        fcmp.percentage = (fcmpFatRequired * 100) / FCMP_FAT;
      }

      if (butterOil) {
        butterOil.percentage = (butterFatRequired * 100) / BUTTER_OIL_FAT;
      }
    }
  }

  /* --------------------------------------------------------
       Remove extremely small adjustment quantities
    -------------------------------------------------------- */

  filteredFormula.forEach(function (item) {
    if (
      item.name === "FCMP" &&
      item.isDynamicAdjustment &&
      Math.abs(item.percentage) < 0.000001
    ) {
      item.percentage = 0;
    }

    if (
      item.name === "Butter Oil" &&
      item.isDynamicAdjustment &&
      Math.abs(item.percentage) < 0.000001
    ) {
      item.percentage = 0;
    }
  });

  /*
       Remove dynamic Butter Oil if its calculated quantity
       is effectively zero.
    */

  const finalFormula = filteredFormula.filter(function (item) {
    if (
      item.name === "Butter Oil" &&
      item.isDynamicAdjustment &&
      item.percentage <= 0.000001
    ) {
      return false;
    }

    return true;
  });

  calculateWaterBalance(finalFormula);

  return finalFormula;
}

/* ============================================================
   WATER BALANCE
============================================================ */

function calculateWaterBalance(formula) {
  const water = formula.find(function (item) {
    return item.isBalance;
  });

  if (!water) {
    return;
  }

  const fixedTotal = formula.reduce(function (sum, item) {
    if (item.isBalance) {
      return sum;
    }

    return sum + item.percentage;
  }, 0);

  water.percentage = 100 - fixedTotal;

  /*
       Prevent negative water.
    */

  if (water.percentage < 0) {
    water.percentage = 0;

    showMessage(
      "warning",
      "The calculated raw-material percentages exceed 100%. " +
        "Water cannot be negative.",
    );
  }
}

/* ============================================================
   LOAD FORMULA INTO TABLE
============================================================ */

function loadFormula() {
  const formula = buildCurrentFormula();

  const tableBody = document.getElementById("materialTableBody");

  tableBody.innerHTML = "";

  formula.forEach(function (item, index) {
    addMaterialRow(item, index + 1);
  });

  updateFreshMilkVisibility();
}

/* ============================================================
   ADD MATERIAL ROW
============================================================ */

function addMaterialRow(item, serial) {
  const tableBody = document.getElementById("materialTableBody");

  const row = document.createElement("tr");

  const ratio = formatNumber(item.percentage);

  const fat = formatNumber(item.fatPercentage);

  const fatContribution = (item.percentage * item.fatPercentage) / 100;

  const materialSolid = getMaterialTotalSolid(item);

  const solid = formatNumber(materialSolid);

  const solidContribution = (item.percentage * materialSolid) / 100;

  const batchSize = parseFloat(document.getElementById("batchSize").value) || 0;

  const quantity = (batchSize * item.percentage) / 100;

  const decimalPlaces = parseInt(
    document.getElementById("decimalSelect").value,
  );

  row.innerHTML = `

        <td>${serial}</td>

        <td>
            ${escapeHtml(item.name)}
        </td>

        <td class="number-cell">
            ${ratio}
        </td>

        <td class="number-cell">
            ${fat}
        </td>

        <td class="number-cell">
            ${formatNumber(fatContribution)}
        </td>

        <td class="number-cell">
            ${solid}
        </td>

        <td class="number-cell">
            ${formatNumber(solidContribution)}
        </td>

        <td class="number-cell required-quantity">
            ${quantity.toFixed(decimalPlaces)}
        </td>

    `;

  tableBody.appendChild(row);
}

/* ============================================================
   CALCULATE
============================================================ */

function calculate() {
  const batchSize = parseFloat(document.getElementById("batchSize").value) || 0;

  const formula = buildCurrentFormula();

  const totalPercentage = formula.reduce(function (sum, item) {
    return sum + item.percentage;
  }, 0);

  const totalFat = formula.reduce(function (sum, item) {
    return sum + (item.percentage * item.fatPercentage) / 100;
  }, 0);

  const targetFat = getTargetFat();

  /*
       SNF / Total Solids.

       Each material contributes its own Total Solid % (Fat +
       its non-fat solid) to the batch, weighted by its ratio —
       the same pattern already used for Fat Contribution %.

       For Fresh Milk, the non-fat solid % is the SNF
       calculated from its fat % and CLR (see
       buildCurrentFormula / getMaterialTotalSolid).
    */

  const hasFreshMilkForSolids = formula.some(function (item) {
    return item.isFreshMilk;
  });

  let snf = 0;

  if (hasFreshMilkForSolids) {
    const milkItem = formula.find(function (item) {
      return item.isFreshMilk;
    });

    snf = milkItem.solidPercentage || 0;
  }

  const totalSolids = formula.reduce(function (sum, item) {
    return sum + (item.percentage * getMaterialTotalSolid(item)) / 100;
  }, 0);

  const targetSolids = getTargetSolids();

  const tolerance = 0.0001;

  /*
       Validate formula percentage.
    */

  if (Math.abs(totalPercentage - 100) > tolerance) {
    showMessage(
      "error",
      "Formula percentage is " +
        formatNumber(totalPercentage) +
        "%. It must equal 100%.",
    );
  }

  /*
       Refresh table.
    */

  const tableBody = document.getElementById("materialTableBody");

  tableBody.innerHTML = "";

  formula.forEach(function (item, index) {
    addMaterialRow(item, index + 1);
  });

  /*
       Summary
    */

  document.getElementById("summaryBatch").textContent =
    formatNumber(batchSize) + " " + document.getElementById("unitSelect").value;

  document.getElementById("summaryFormula").textContent = currentFormula;

  document.getElementById("summaryPercentage").textContent =
    formatNumber(totalPercentage) + "%";

  document.getElementById("summaryQuantity").textContent =
    formatNumber(batchSize) + " " + document.getElementById("unitSelect").value;

  document.getElementById("summaryFat").textContent =
    formatNumber(totalFat) + "%";

  document.getElementById("summaryTargetFat").textContent =
    formatNumber(targetFat) + "%";

  document.getElementById("targetFatDisplay").textContent =
    formatNumber(targetFat) + "%";

  document.getElementById("snfDisplay").textContent =
    formatNumber(snf) + "%";

  document.getElementById("totalSolidsDisplay").textContent =
    formatNumber(totalSolids) + "%";

  document.getElementById("targetSolidsDisplay").textContent =
    formatNumber(targetSolids) + "%";

  document.getElementById("summarySolids").textContent =
    formatNumber(totalSolids) + "%";

  document.getElementById("summaryTargetSolids").textContent =
    formatNumber(targetSolids) + "%";

  /*
       Fat validation
    */

  if (
    Math.abs(totalFat - targetFat) > 0.001 &&
    formula.some(function (item) {
      return item.isFreshMilk;
    })
  ) {
    if (totalFat < targetFat) {
      showMessage(
        "warning",
        "Calculated fat is " +
          formatNumber(totalFat) +
          "%. Target is " +
          formatNumber(targetFat) +
          "%.",
      );
    }
  }

  /*
       Total Solids validation.
    */

  if (
    hasFreshMilkForSolids &&
    Math.abs(totalSolids - targetSolids) > 0.001
  ) {
    showMessage(
      "warning",
      "Calculated total solids is " +
        formatNumber(totalSolids) +
        "%. Target is " +
        formatNumber(targetSolids) +
        "%.",
    );
  }

  updateFreshMilkVisibility();
}

/* ============================================================
   FRESH MILK FIELD VISIBILITY
============================================================ */

function updateFreshMilkVisibility() {
  const formula = FORMULAS[currentFormula];

  const hasFreshMilk = formula.some(function (item) {
    return item.isFreshMilk;
  });

  const group = document.getElementById("freshMilkFatGroup");

  const clrGroup = document.getElementById("clrGroup");

  if (hasFreshMilk) {
    group.classList.remove("hidden");
    clrGroup.classList.remove("hidden");
  } else {
    group.classList.add("hidden");
    clrGroup.classList.add("hidden");
  }
}

/* ============================================================
   ADJUSTMENT CONTROL VISIBILITY
============================================================ */

function updateAdjustmentControls() {
  const method = document.getElementById("adjustmentMethod").value;

  const ratioGroup = document.getElementById("fcmpRatioGroup");

  if (method === "both") {
    ratioGroup.classList.remove("hidden");
  } else {
    ratioGroup.classList.add("hidden");
  }

  calculate();
}

/* ============================================================
   MESSAGE BOX
============================================================ */

function showMessage(type, message) {
  const box = document.getElementById("messageBox");

  box.className = "message-box " + type;

  box.textContent = message;
}

function hideMessage() {
  const box = document.getElementById("messageBox");

  box.className = "message-box hidden";

  box.textContent = "";
}

/* ============================================================
   FORMAT NUMBER
============================================================ */

function formatNumber(value) {
  const decimalPlaces = parseInt(
    document.getElementById("decimalSelect").value,
  );

  if (Number.isNaN(value)) {
    return "0";
  }

  return Number(value).toFixed(decimalPlaces);
}

/* ============================================================
   RESET
============================================================ */

function resetCalculator() {
  document.getElementById("batchSize").value = 1200;

  document.getElementById("unitSelect").value = "KG";

  document.getElementById("decimalSelect").value = "2";

  document.getElementById("targetFat").value = "10";

  document.getElementById("targetSolids").value = String(STANDARD_TOTAL_SOLIDS);

  document.getElementById("freshMilkFat").value = "3.8";

  document.getElementById("clrValue").value = "28.5";

  document.getElementById("adjustmentMethod").value = "fcmp";

  document.getElementById("fcmpRatio").value = "70";

  currentFormula = "MIX-1";

  document.getElementById("formulaSelect").value = currentFormula;

  hideMessage();

  loadFormula();

  updateAdjustmentControls();

  calculate();
}

/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}
