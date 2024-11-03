import { createContext, Dispatch, SetStateAction } from "react";
import { PaiName } from "../../@types/types";
import { PaiOption, PaiSelectionType } from "./PaiSelectionContext";

export type CalculationStep =
  | {
      step: "select-pai";
    }
  | {
      step: "select-dora";
    }
  | {
      step: "select-ura-dora";
    }
  | {
      step: "select-hora-pai";
    }
  | {
      step: "finish";
    }
  | {
      step: "error";
      message: string;
    };

const CalculationStepContext = createContext<
  [CalculationStep, Dispatch<SetStateAction<CalculationStep>>] | [null, null]
>([null, null]);

export default CalculationStepContext;
