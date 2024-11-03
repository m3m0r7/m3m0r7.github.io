import { createContext, Dispatch, SetStateAction } from "react";
import { PaiName, ScoreData } from "../../@types/types";

const ScoreDataContext = createContext<[ScoreData | null, Dispatch<SetStateAction<ScoreData | null>>] | [null, null]>([null, null])

export default ScoreDataContext
