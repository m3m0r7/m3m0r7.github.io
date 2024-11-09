import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { PaiOption } from "./PaiSelectionContext";
import { MahjongOption as Option } from "../../@types/types";
import { SystemOption } from "./SystemOptionContext";

type AvailableFrameType = PaiOption | Partial<Option> | SystemOption;

export type FrameSetType<T> = {
  frame: T;
  dispatch: Dispatch<SetStateAction<T>>;
};

type UseStateType<T> = [T, Dispatch<SetStateAction<T>>];

const frameSets: { frames: FrameSetType<any>[] } = {
  frames: [],
};

const FRAME_MAX_DEPTH = 10;

export const createFrameSet = <T extends AvailableFrameType>(
  value: UseStateType<T>,
): UseStateType<T> => {
  const [state, setState] = value;
  return [
    state,
    (parameter: SetStateAction<T>) => {
      const nextState =
        typeof parameter === "function" ? parameter(state) : parameter;

      const lastFrame = frameSets.frames[frameSets.frames.length - 1] ?? null;

      if (
        lastFrame &&
        JSON.stringify(lastFrame.frame) === JSON.stringify(nextState)
      ) {
        return setState(parameter);
      }

      const newFrameSets = [
        ...(frameSets.frames ?? []),
        {
          frame: nextState,
          dispatch: setState,
        },
      ];

      frameSets.frames =
        newFrameSets.length >= FRAME_MAX_DEPTH
          ? newFrameSets.slice(
              newFrameSets.length - FRAME_MAX_DEPTH + 1,
              FRAME_MAX_DEPTH + (newFrameSets.length - FRAME_MAX_DEPTH),
            )
          : newFrameSets;

      return setState(parameter);
    },
  ];
};
