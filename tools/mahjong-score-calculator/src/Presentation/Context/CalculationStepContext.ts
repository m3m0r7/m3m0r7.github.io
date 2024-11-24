import { createContext, Dispatch, SetStateAction } from "react";

export type CalculationStepType =
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
      step: "select-furo-pai";
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

export const CalculationStepInitial: CalculationStepType = {
  step: "select-pai",
};

const CalculationStepTypeContext = createContext<
  | [CalculationStepType, Dispatch<SetStateAction<CalculationStepType>>]
  | [null, null]
>([null, null]);

export default CalculationStepTypeContext;
