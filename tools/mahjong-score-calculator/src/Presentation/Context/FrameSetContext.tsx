import React, { Dispatch, SetStateAction } from "react";
import { PaiOptionType } from "./PaiSelectionContext";
import { MahjongOption as Option } from "../../@types/types";
import { SystemOption } from "./SystemOptionContext";

const FRAME_MAX_DEPTH = 16 * 4;

type AvailableFrameType = PaiOptionType | Partial<Option> | SystemOption;

export type FrameSetType<T> = {
  previousFrame: T;
  nextFrame: T;
  dispatch: Dispatch<SetStateAction<T>>;
};

type UseStateType<T> = [T, Dispatch<SetStateAction<T>>];

type FrameType = {
  cursor: number;
  frames: FrameSetType<any>[];
};
const frameSets: FrameType = {
  cursor: 0,
  frames: [],
};

export const createFrameSet = <T extends AvailableFrameType>(
  value: UseStateType<T>,
): UseStateType<T> => {
  const [state, setState] = value;
  return [
    state,
    (parameter: SetStateAction<T>) => {
      const nextState =
        typeof parameter === "function" ? parameter(state) : parameter;

      const currentFrames = frameSets.frames.slice(0, frameSets.cursor);
      const lastFrame = currentFrames[currentFrames.length - 1] ?? null;

      if (
        lastFrame &&
        JSON.stringify(lastFrame.previousFrame) === JSON.stringify(state)
      ) {
        return setState(parameter);
      }

      // NOTE: To be aligned frame sets by current cursor
      frameSets.frames = currentFrames;

      const newFrameSets = [
        ...(frameSets.frames ?? []),
        {
          previousFrame: state,
          nextFrame: nextState,
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
      frameSets.cursor = frameSets.frames.length;
      return setState(parameter);
    },
  ];
};

export const haveBackwardFrameSet = () => {
  return frameSets.frames.slice(0, frameSets.cursor).length > 0;
};

export const haveForwardFrameSet = () => {
  return frameSets.frames.slice(frameSets.cursor).length > 0;
};

export const backwardFrameSet = (): FrameSetType<AvailableFrameType> | null => {
  const result = frameSets.frames[frameSets.cursor - 1] ?? null;
  if (result === null) {
    return null;
  }
  if (frameSets.cursor > 0) {
    frameSets.cursor--;
  }

  result.dispatch(result.previousFrame);

  return result;
};

export const forwardFrameSet = (): FrameSetType<AvailableFrameType> | null => {
  const result = frameSets.frames[frameSets.cursor] ?? null;
  if (result === null) {
    return null;
  }

  if (frameSets.cursor <= frameSets.frames.length) {
    frameSets.cursor++;
  }

  result.dispatch(result.nextFrame);

  return result;
};

const FrameSetContext = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default FrameSetContext;
