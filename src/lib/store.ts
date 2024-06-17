import { atom } from "jotai";

import { TTransactionTypes } from "./types";

export const hoveredStatisticAtom = atom<TTransactionTypes | null>(null);
